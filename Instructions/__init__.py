from otree.api import *
import random
import pandas as pd
from collections import Counter
from numpy import random as rnd
import numpy as np
doc = """
Your app description
"""


class C(BaseConstants):
    NAME_IN_URL         = 'Intro'
    PLAYERS_PER_GROUP   = None
    NUM_ROUNDS          = 1
    # Setup/Experiment variables 
    iPracticeRounds     = 3
    iOptions            = 21
    # iNumTrials          = 5
    iNumTrials          = iPracticeRounds + 3*iOptions
    # Template variables
    AvgDur              = '30'
    iBonus              = '2 pounds'
    # Figs/Files paths
    figUvA_logo         = 'global/figures/UvA_logo.png'
    path1               = 'global/figures/example1.png'
    path2               = 'global/figures/example2.png'
    pathGif             = 'global/figures/demoMouseCrop.gif'
    pathData            = '_static/global/files/Data4Exp.csv'
    imgCandidate        = "global/figures/candidate.png"
    imgNumbers          = "global/figures/numbers/n_"

    # Links 
    # You might want to have different links, for when they submit differen answers
    sLinkReturn         = "https://app.prolific.com/submissions/complete?cc=XXXXX"
    sLinkReturnCal      = "https://app.prolific.com/submissions/complete?cc=YYYYY"
    sLinkOtherBrowser   = "https://YOUR-EXPERIMENT.herokuapp.com/room/room1"
    SubmitLink          = 'https://app.prolific.com/submissions/complete?cc=ZZZZZ'



class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    pass

# FUNCTIONS
    
def creating_session(subsession):
    # Load Session variables
    s = subsession.session 
    if subsession.round_number ==1:
        for player in subsession.get_players():
            # Store any treatment variables or things that stay constant across rounds/apps
            p = player.participant
            # When creating the session, you can define whether you have a random treatment or a specific one. 
            if s.config['treatment']=='random':
                p.sTreatment = random.choice(['Control','Low','High'])
            else:
                p.sTreatment = s.config['treatment']
            # Randomly selected trial
            p.iSelectedTrial = random.randint(C.iPracticeRounds,C.iNumTrials)

            ## LOAD HERE YOUR DATABASE 



# PAGES


class Instructions(Page):
    form_model = 'player'
    form_fields = []

    @staticmethod
    def js_vars(player: Player):
        ## Variables necessary for javascript
        p = player.participant
        return dict(
            lSolutions = [
                'a','b', 'a', str(C.iNumTrials) # Solutions to control questions
            ]
        )
    
    @staticmethod
    def vars_for_template(player: Player):
        # Variables for HTML
        p = player.participant
        return dict(
            Treatment = p.sTreatment
        )
    

page_sequence = [Instructions]

