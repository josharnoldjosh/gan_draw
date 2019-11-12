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
import requests
import parlai.mturk.core.mturk_utils as mturk_utils
from joblib import Parallel, delayed

class DrawerOnboardingWorld(MTurkOnboardWorld):
    def parley(self):
        ad = {}
        ad['id'] = 'System'
        ad['text'] = (
            "Welcome onboard! You'll be playing the role of the Drawer.\n"            
            "Please scroll down and watch the video to the left. After, please test out drawing on the canvas to the left.\n"
            "If it is hard to see, please zoom out on your web browser.\n"
            "Once you think you are comfortable with how to use the canvas to draw, please send any message"
            " to continue. "            
        )

        self.mturk_agent.observe(ad)
        self.mturk_agent.act()        
        self.episodeDone = True
        
class TellerOnboardingWorld(MTurkOnboardWorld):
    def parley(self):
        ad = {}
        ad['id'] = 'System'
        ad['text'] = (
            "Welcome onboard! You'll be playing the role of the Teller. You will see an image to your left. Please sequentially describe it to the drawer in a way in which it can be step-by-step recreated. For example, \"there is a mountain in the background\" then on your next turn, \"there is the ocean in the foreground\", then in your next turn, \"there is a tree to the left\", and so on. Please send any message to continue. NOTE: If you and your partner can successfully work together to draw an image that is similar enough to the one on your left, you will BOTH RECEIVE A $1 BONUS. It is in your best interest to assist your partner to draw the image well."
        )
        self.mturk_agent.observe(ad)
        self.mturk_agent.act()
        self.episodeDone = True

class MultiRoleAgentWorld(MTurkTaskWorld):

    def __init__(self, opt, mturk_agents):        
        mturk_utils.setup_aws_credentials()
        is_sandbox = True
        self.client = mturk_utils.get_mturk_client(is_sandbox)
        self.bonus_amount = 1.0

        self.mturk_agents = mturk_agents
        for agent in mturk_agents:
            self.assignment_id = agent.assignment_id
            # print(agent.assignment_id)
            if agent.demo_role == 'Drawer':
                self.drawer = agent
            elif agent.demo_role == 'Teller':
                self.teller = agent
        self.episodeDone = False
        self.turn_idx = 0
        self.dialog = []
        self.should_pay_bonus = False
        self.drawer_rating_from_teller = 3
        self.teller_rating_from_drawer = 3
        self.soft_block = []

        self.selectImageForTask()

        self.unique_task_id = self.drawer.worker_id + self.teller.worker_id + self.teller.assignment_id + self.drawer.assignment_id
        print("\nStarting task with id", self.unique_task_id)
        return

    def taskData(self):        
        return {"task_id":self.unique_task_id, "turn_idx":self.turn_idx, 'image_name':self.image_file}

    def selectImageForTask(self):        
        path_ext = "/home/jarnold9/ParlAI/parlai/mturk/tasks/react_task_demo/gan_draw/landscape_target/"
        self.image_file = "semantic"
        while True:
            self.image_file = random.choice(os.listdir(path_ext))
            if "semantic" not in self.image_file and "DS_Store" not in self.image_file:
                break
        # print(self.image_file)

    def pay_bonus(self):
        self.should_pay_bonus = True        
        with open("/home/jarnold9/ParlAI/parlai/mturk/tasks/react_task_demo/gan_draw/saved_data/bonus/"+self.unique_task_id+'_bonus.json', 'w', encoding='utf-8') as f:
            json.dump({"assignment_id":self.assignment_id, "worker_id":[self.drawer.worker_id, self.teller.worker_id]}, f, ensure_ascii=False, indent=4)   

    def get_scores(self):
        r = requests.post('https://language.cs.ucdavis.edu/get_score', data={'unique_id':self.unique_task_id, "turn_idx":self.turn_idx})
        # print(r.status_code, r.reason)
        if r.status_code != 200: return "0% Unfortunately you did not qualify for the bonus."              
        data = r.json()
        score_result = data["co_draw"]
        if score_result >= 2.0:
            self.pay_bonus()
            return str(score_result)+" out of 5. Congradulations, you qualify for the bonus! The $1 bonus should be paid instantly! Great work!" 
        return str(score_result)+" out of 5. Unfortunately you did not qualify for the bonus."

    def force_finish_task(self):
        self.episodeDone = True        
        ad = {'id': 'System', 'text': "The task has been completed. Thank you for your time."}
        self.teller.observe(ad)
        ad['text'] += ' Your automatic score on the task is: ' + self.get_scores()
        self.drawer.observe(ad)        

    def try_finish_task(self, teller_act):
        if "done" in validate(teller_act)['text'].lower():
            # First, get the users to rate each other
            self.get_user_ratings()

            # Next, finish the task
            self.dialog.append({"system":"TASK COMPLETE", "turn_idx":self.turn_idx})
            self.save_data()
            self.force_finish_task() 
            return True
        return False

    def parse_rating(self, act):
        text = act["text"]       
        if "five" in text:
            return 5
        if "four" in text:
            return 4
        if "three" in text:
            return 3
        if "two" in text:
            return 2
        if "one" in text:
            return 1
        return 3

    def get_user_ratings(self):
        drawer_message = """
                Thank you for completing the task.
                How would you rate your partner's performance on a scale of one to five?
                A five indicates they gave clear descriptions of the image.
                A one indicates they failed to provide a description of the image.
                Please enter a single number, either one, two, three, four or five.
                """
        ad = {'id': 'System', 'text': drawer_message, "task_data":self.taskData()}
        self.drawer.observe(ad)
        drawer_act = self.drawer.act()
        self.teller_rating_from_drawer = self.parse_rating(drawer_act)        

        teller_message = """
                Thank you for completing the task.
                How would you rate your partner's performance on a scale of one to five?
                A five indicates they drew a decent quality image & made an effort.
                A one indicates their drawn image doesn't look similar to the target image.
                Please enter a single number, either one, two, three, four or five.
                """
        ad = {'id': 'System', 'text': teller_message, "task_data":self.taskData()}
        self.teller.observe(ad)
        teller_act = self.teller.act()
        self.drawer_rating_from_teller = self.parse_rating(teller_act)
        
        if self.drawer_rating_from_teller < 3:
            self.soft_block += [self.drawer.worker_id]
        if self.teller_rating_from_drawer < 3:
            self.soft_block += [self.teller.worker_id]
        return

    def parley(self):
        # Inform the teller to start drawer & also how to end the task
        if self.turn_idx == 0:
            # Tell the drawer to do what he does best, draw
            ad = {'id': 'System', 'text': "Welcome to the task. Your goal is to collaborate with another turker to redraw an image as accurately as possible.", "task_data":self.taskData()}
            self.drawer.observe(ad)
            ad = {'id': 'System', 'text': "After the other turker begins describing the image, please try to draw it to the best of your ability. Please ASK QUESTIONS ANYTIME you want CLARIFICATION about the DESCRIPTION, otherwise, after you finish drawing, please ask the other turker for the next instruction. It is in your best interest to ask clarifying questions as you will receive an instant $1 bonus if you can redraw the image accurately.", "task_data":self.taskData()}
            self.drawer.observe(ad)

            ad = {'id': 'System', 'text': "Welcome to the task. Your goal is to collaborate with another turker to redraw an image as accurately as possible.", "task_data":self.taskData()}
            self.teller.observe(ad)
            ad = {'id': 'System', 'text': "Please click LOAD IMAGE and then begin describing the image to your left. During the task, you may \"peek\" at what the Drawer has drawn thus far, to aid you in your descriptions. It is in your best interest to describe the image clearly in detail as you will receive an instant $1 bonus if you do well! FINALLY, press the \"FINISH TASK\" button at anytime to end & complete the task. However, please only end the task once you believe the image has been drawn accurately by the other turker in order to receive the instant bonus.", "task_data":self.taskData()}
            self.teller.observe(ad)
        
        # Get the tellers description
        teller_act = self.teller.act()
        teller_act["task_data"] = self.taskData()        

        # Optionally end the task
        should_finish = self.try_finish_task(teller_act)
        if should_finish:
            return

        # Let drawer see what the teller said
        self.drawer.observe(validate(teller_act))        

        # get the drawer message & image
        drawer_act = self.drawer.act()
        drawer_act["task_data"] = self.taskData()        

        self.teller.observe(validate(drawer_act))

        # update our dialog
        self.dialog.append({"teller":teller_act['text'], "drawer":drawer_act['text'], "turn_idx":self.turn_idx})

        # update turns
        self.turn_idx += 1

        self.save_data()        

        if self.turn_idx >= 20:
            self.force_finish_task()

    def save_data(self):     
        with open("/home/jarnold9/ParlAI/parlai/mturk/tasks/react_task_demo/gan_draw/saved_data/"+self.unique_task_id+'.json', 'w', encoding='utf-8') as f:
            json.dump({
                "dialog":self.dialog, 
                "taskData":self.taskData(),
                "teller_rating_from_drawer":self.teller_rating_from_drawer,
                "drawer_rating_from_teller":self.drawer_rating_from_teller,
                "drawer_worker_id":self.drawer.worker_id,
                "teller_worker_id":self.teller.worker_id,
                "assignment_id":self.drawer.assignment_id
                }, f, ensure_ascii=False, indent=4)

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
        global review_agent
        def review_agent(ag):           
            if hasattr(ag, 'not_approve'):
                pass
            else:
                ag.approve_work()
        Parallel(n_jobs=len(self.mturk_agents), backend='threading')(delayed(review_agent)(agent) for agent in self.mturk_agents)    
