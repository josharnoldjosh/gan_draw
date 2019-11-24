#!/usr/bin/env python3

# Copyright (c) Facebook, Inc. and its affiliates.
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

task_config = {}


task_config['frontend_version'] = 1

"""A short and descriptive title about the kind of task the HIT contains.
On the Amazon Mechanical Turk web site, the HIT title appears in search results,
and everywhere the HIT is mentioned.
"""
task_config['hit_title'] = 'Fun Drawing Game Task: $1 BONUS ON TASK SUCCESS'


"""A description includes detailed information about the kind of task the HIT contains.
On the Amazon Mechanical Turk web site, the HIT description appears in the expanded
view of search results, and in the HIT and assignment screens.
"""
task_config[
    'hit_description'
] = 'Chat with another turker to help each other recreate an image.'


"""One or more words or phrases that describe the HIT, separated by commas.
On MTurk website, these words are used in searches to find HITs.
"""
task_config['hit_keywords'] = 'chat,question,answer,draw,art'


"""A detailed task description that will be shown on the HIT task preview page
and on the left side of the chat page. Supports HTML formatting.
"""
task_config[
    'task_description'
] = '''
In this task, you'll either play the role as the teller or the drawer<br><br>

<b>As the teller:</b> You will sequentially describing an image to your left to the drawer in a way in which it can be step-by-step recreated.
For example, "there is a mountain in the background" then on your next turn, "there is the ocean in the foreground", then in your next turn, "there is a tree to the left", and so on.                    
Once you have finished describing the image, type "done" in the chat to end the task.
<br>

<b>As the drawer:</b> You will be drawing what the teller describes on a canvas, step by step. For example, on your first turn, you might draw a mountain in the background, and on your second turn you might draw the ocean in front of the mountain.<br>

If you can redraw the image with a high enough accuracy, you will be granted an INSTANT $1 Bonus.

If you are ready, please click "Accept HIT" to start this task.
'''
