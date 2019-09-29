#!/usr/bin/env python3

# Copyright (c) Facebook, Inc. and its affiliates.
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.
from parlai.mturk.core.worlds import MTurkOnboardWorld, MTurkTaskWorld
import threading
from parlai.core.worlds import validate
import json
import os, random
from PIL import Image
from io import BytesIO
import base64

class DrawerOnboardingWorld(MTurkOnboardWorld):
    def parley(self):
        ad = {}
        ad['id'] = 'System'
        ad['text'] = (
            "Welcome onboard! You'll be playing the role of the Drawer."
            " Please take the time to get familar with the canvas to the left."
            " Once you are comfortable with drawing, please send any message"
            " to continue. After that, please remember to always click \"convert\""
            " before sending a message to end your turn. Note: you can end your turn by typing \"done\" in the chat."
        )

        self.mturk_agent.observe(ad)
        self.mturk_agent.act()
        self.episodeDone = True
        
class TellerOnboardingWorld(MTurkOnboardWorld):
    def parley(self):
        ad = {}
        ad['id'] = 'System'
        ad['text'] = (
            "Welcome onboard! You'll be playing the role of the Teller. You will see an image to your left. Please sequentially describe it to the drawer in a way in which it can be step-by-step recreated. For example, \"there is a mountain in the background\" then on your next turn, \"there is the ocean in the foreground\", then in your next turn, \"there is a tree to the left\", and so on. Please send any message to continue."
        )
        self.mturk_agent.observe(ad)
        self.mturk_agent.act()
        self.episodeDone = True

class MultiRoleAgentWorld(MTurkTaskWorld):

    def __init__(self, opt, mturk_agents):
        self.mturk_agents = mturk_agents
        for agent in mturk_agents:
            if agent.demo_role == 'Drawer':
                self.drawer = agent
            elif agent.demo_role == 'Teller':
                self.teller = agent
        self.episodeDone = False
        self.turn_idx = 0
        self.dialog = []

        self.selectImageForTask()

        self.unique_task_id = self.drawer.worker_id + self.teller.worker_id + self.teller.assignment_id + self.drawer.assignment_id
        return

    def taskData(self):        
        return {"task_id":self.unique_task_id, "turn_idx":self.turn_idx, 'image_name':self.image_file}

    def selectImageForTask(self):        
        path_ext = "/home/jarnold9/ParlAI/parlai/mturk/tasks/react_task_demo/gan_draw/landscape_target/"
        self.image_file = random.choice(os.listdir(path_ext))
        print(self.image_file)       

    def try_finish_task(self, teller_act):
        if "done" in validate(teller_act)['text'].lower():
            self.episodeDone = True
            # save data?
            ad = {'id': 'System', 'text': "The task has been completed. Thank you for your time."}
            self.teller.observe(ad)
            self.drawer.observe(ad)
            self.shutdown()

    def parley(self):
        # Inform the teller to start drawer & also how to end the task
        if self.turn_idx == 0:
            ad = {'id': 'System', 'text': "Please begin describing the image to your left. Once during the task, you may \"peek\" at what the Drawer has drawn thus far, to aid you in your descriptions. Please think about the right time to use it carefully.", "task_data":self.taskData()}
            self.teller.observe(ad)
        elif self.turn_idx > 3:
            pass
            # ad = {'id': 'System', 'text': "Remember, once there is nothing left to say about the image, please send a message saying \"done\". Otherwise, please continue describing the image.", "task_data":self.taskData()}
            # self.teller.observe(ad)
        
        # Get the tellers description
        teller_act = self.teller.act()
        teller_act["task_data"] = self.taskData()

        # Optionally end the task
        self.try_finish_task(teller_act)
        
        # Let drawer see what the teller said
        self.drawer.observe(validate(teller_act))        

        # Tell the drawer to do what he does best, draw
        # ad = {'id': 'System', 'text': "Please draw what the Turker described above. When you've finished drawing, please either send a message saying \"done\", or ask a question about the image.", "task_data":self.taskData()}
        # self.drawer.observe(ad)

        # get the drawer message & image
        drawer_act = self.drawer.act()
        drawer_act["task_data"] = self.taskData()

        self.teller.observe(validate(drawer_act))

        # update our dialog
        self.dialog.append({"teller":teller_act['text'], "drawer":drawer_act['text'], "turn_idx":self.turn_idx})

        # update turns
        self.turn_idx += 1

        self.save_data()

    def save_data(self):     
        with open("/home/jarnold9/ParlAI/parlai/mturk/tasks/react_task_demo/gan_draw/saved_data/"+self.unique_task_id+'.json', 'w', encoding='utf-8') as f:
            json.dump(self.dialog, f, ensure_ascii=False, indent=4)

    def episode_done(self):
        return self.episodeDone

    def shutdown(self):        
        # Parallel shutdown of agents
        def shutdown_agent(agent):
            try:
                agent.shutdown(timeout=None)
            except Exception:
                agent.shutdown()  # not MTurkAgent

        threads = []
        for agent in self.mturk_agents:
            t = threading.Thread(target=shutdown_agent, args=(agent,))
            t.start()
            threads.append(t)
        for t in threads:
            t.join()

    def review_work(self):
        # Can review the work here to accept or reject it
        pass

    def get_custom_task_data(self):
        return       

    def get_custom_task_data(self):
        return
