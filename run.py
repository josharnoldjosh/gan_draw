#!/usr/bin/env python3

# Copyright (c) Facebook, Inc. and its affiliates.
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.
from parlai.core.params import ParlaiParser
from worlds import (
    DrawerOnboardingWorld,
    TellerOnboardingWorld,
    MultiRoleAgentWorld,
)
from parlai.mturk.core.mturk_manager import MTurkManager
from task_config import task_config
import os

BONUS_PAY_AMOUNT = 1.0

def main():
    """Handles setting up and running a ParlAI-MTurk task by instantiating
    an MTurk manager and configuring it for the qa_data_collection task
    """

    # Get relevant arguments
    argparser = ParlaiParser(False, False)
    argparser.add_parlai_data_path()
    argparser.add_mturk_args()
    opt = argparser.parse_args()

    # Set the task name to be the folder name
    opt['task'] = os.path.basename(os.path.dirname(os.path.abspath(__file__)))

    # append the contents of task_config.py to the configuration
    opt.update(task_config)

    # Select an agent_id that worker agents will be assigned in their world
    mturk_agent_roles = ['Drawer', 'Teller']

    # Instantiate an MTurkManager with the given options and a maximum number
    # of agents per world of 1 (based on the length of mturk_agent_ids)
    mturk_manager = MTurkManager(
        opt=opt, mturk_agent_ids=mturk_agent_roles, use_db=True
    )
    mturk_manager.setup_server(
        task_directory_path=os.path.dirname(os.path.abspath(__file__))
    )

    role_index = 0

    # Create an onboard_function, which will be run for workers who have
    # accepted your task and must be completed before they are put in the
    # queue for a task world.
    def run_onboard(worker):
        nonlocal role_index
        role = mturk_agent_roles[role_index % len(mturk_agent_roles)]
        role_index += 1
        worker.update_agent_id('Onboarding {}'.format(role))
        worker.demo_role = role
        if role == 'Drawer':
            world = DrawerOnboardingWorld(opt=opt, mturk_agent=worker)
        elif role == 'Teller':
            world = TellerOnboardingWorld(opt=opt, mturk_agent=worker)
        while not world.episode_done():
            world.parley()
        world.shutdown()
        return world.prep_save_data([worker])

    # If we want to use the above onboard function, we can replace the below
    # with set_onboard_function(onboard_function=run_onboard)
    mturk_manager.set_onboard_function(onboard_function=run_onboard)

    agent_qualifications = [
        {'QualificationTypeId': '00000000000000000060','Comparator': 'Exists','RequiredToPreview': True}, # adult qualification
        {'QualificationTypeId': '000000000000000000L0','Comparator': 'GreaterThanOrEqualTo', 'IntegerValues': [96], 'RequiredToPreview': True}, # percent assignments approved
        # {'QualificationTypeId':'2F1QJWKUDD8XADTFD2Q0G6UTO95ALH', 'Comparator':'Exists', "ActionsGuarded":"DiscoverPreviewAndAccept", 'RequiredToPreview': True},
        # {'QualificationTypeId':'00000000000000000040', 'Comparator': 'GreaterThanOrEqualTo', 'IntegerValues': [20], 'RequiredToPreview': True, 'RequiredToPreview': True}
    ]

    if opt["is_sandbox"] == True:
        agent_qualifications = []

    try:
        # Initialize run information
        mturk_manager.start_new_run()

        # Set up the sockets and threads to recieve workers
        mturk_manager.ready_to_accept_workers()

        # Create the hits as specified by command line arguments
        mturk_manager.create_hits(qualifications=agent_qualifications)        

        # Check workers eligiblity acts as a filter, and should return
        # the list of all workers currently eligible to work on the task
        # Can be used to pair workers that meet certain criterea
        def check_workers_eligibility(workers):
            filled_roles = []
            use_workers = []
            for worker in workers:
                if worker.demo_role not in filled_roles:
                    use_workers.append(worker)
                    filled_roles.append(worker.demo_role)
            return use_workers

        eligibility_function = {'func': check_workers_eligibility, 'multiple': True}

        # Assign worker roles is used to determine what the role each worker
        # in the given worker list will play. Setting `id` to None will return
        # the worker to the pool rather than putting them in a given task,
        # which is useful for having tasks with different possible worker
        # counts.
        def assign_worker_roles(workers):
            for worker in workers:
                worker.id = worker.demo_role

        # Define the task function, which will be run with workers that are
        # as the main task.
        global run_conversation

        def run_conversation(mturk_manager, opt, workers):
            # Create the task world
            world = MultiRoleAgentWorld(opt=opt, mturk_agents=workers)
            # run the world to completion
            while not world.episode_done():
                world.parley()

            if (world.should_pay_bonus == True):
                print("Image threshold met! Paying bonus!")
                for ag in workers:
                    mturk_manager.pay_bonus(ag.worker_id, BONUS_PAY_AMOUNT, ag.assignment_id, "Successfully recreated an image to a high enough quality.", ag.assignment_id)
            else:
                print("Failed to create the image to a high enough quality.")

            # shutdown and review the work
            world.shutdown()
            world.review_work()

            # Return the contents for saving
            return world.prep_save_data(workers)

        # Begin the task, allowing mturk_manager to start running the task
        # world on any workers who connect
        mturk_manager.start_task(
            eligibility_function=eligibility_function,
            assign_role_function=assign_worker_roles,
            task_function=run_conversation,
        )
    except BaseException:
        raise
    finally:
        # Any hits that aren't claimed or completed have to be shut down. Must
        # keep the world running until that point.
        mturk_manager.expire_all_unassigned_hits()
        # Shutdown the manager and free all related resources
        mturk_manager.shutdown()


if __name__ == '__main__':
    main()
