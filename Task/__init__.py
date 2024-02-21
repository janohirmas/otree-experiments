from otree.api import *
import numpy.random as rnd  
import random 
import pandas as pd 

doc = """
Your app description
"""


class C(BaseConstants):
    NAME_IN_URL = 'Task'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 10
    NUM_PROUNDS = 1
    # List of attributes (id)
    lAttrID     = ['p','q','s','t']
    lAttrNames  = ['Price','Quality','Sustainability','Tax']
    # Template vars
    lColNames   = ['A','B','C','D']


    # In between round messages
    BetweenTrialMessages = {
        "1": f"Now you will have {NUM_PROUNDS} practice rounds.", 
        str(int(NUM_PROUNDS+1)): "The practice rounds are over."
        }
    # Image 
    imgCandidate    = "global/figures/candidate.png"
    imgNumbers      = "global/figures/numbers/n_"
    # Confidence page
    iLikertConf     = 7
    sConfQuestion   = f"From 1 to {iLikertConf}, how confident are you on your choice?"
    sLeftConf       = "Very unsure"
    sRightConf      = "Very sure"




class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    # DVs
    sChoice     = models.StringField()
    dRT_dec     = models.FloatField()
    iConfidence = models.IntegerField()
    dRT_conf    = models.FloatField()

    # Attention variables
    sNames      = models.LongStringField(blank=True)
    sDT         = models.LongStringField(blank=True)

    # # Timestamps
    sStartDec   = models.StringField()
    sEndDec     = models.StringField()
    sStartCross = models.StringField()
    sEndCross   = models.StringField()
    sStartConf = models.StringField()
    sEndConf   = models.StringField()


    # Others 
    sBetweenBtn = models.StringField()


    # # Candidates
    # sCandA      = models.StringField()
    # sCandB      = models.StringField()
    # sStartConf  = models.StringField()
    # sEndConf    = models.StringField()
    # # Other

    
def creating_session(subsession):
    # Load Session variables
    s = subsession.session 
    if subsession.round_number==1:
        for player in subsession.get_players():
            p = player.participant
            #### Randomize order of attributes
            lPos = C.lAttrID[:]         # Create hard copy of attributes
            random.shuffle(lPos)        # Shuffle order
            p.lPos = lPos               # Store it as a participant variable
            #### Select trial for payment (from the first round after practice rounds to the last)
            p.iSelectedTrial = random.randint(C.NUM_PROUNDS+1,C.NUM_ROUNDS)

    for player in subsession.get_players():
        p = player.participant
        player.sBetweenBtn = random.choice(['left','right'])


def attributeList(lValues,lPos):

    lAttributes = []
    lOrder      = []
    for i in range(len(C.lAttrID)):
        id                  = C.lAttrID[i]      
        name                = C.lAttrNames[i]  
        # Store the order of the list
        lOrder.append(lPos.index(id))
        lPaths = []
        for v in lValues[i]:
            lPaths.append(f"{C.imgNumbers}{v}.png")
        # Create object with all the relevant variables
        Attr = {
            'id'        : id,
            'name'      : name,
            'lValues'    : lPaths,
        }
        lAttributes.append(Attr)
    
    lFinal = [ lAttributes[x] for x in lOrder]
    return lFinal

# PAGES

class Decision(Page):
    form_model      = 'player'
    form_fields     = [ 'sChoice']
    # form_fields     = [ 'sStartDec','sEndDec', 'dRT_dec', 'sNames', 'sDT' , 'dTime2first', 'sChoice']
    
    @staticmethod
    def vars_for_template(player: Player):
        # Order of attributes (from participant var)
        p = player.participant
        lPos = p.lPos      
        # Candidates values          
        lValues = [rnd.randint(0,6,len(C.lColNames)) for _ in range(len(C.lAttrID))]
        return dict(
            lAttr = attributeList(lValues,lPos),
        )
    
    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        p = player.participant
        
        if player.round_number == p.iSelectedTrial: 
            p.bChoseA = player.iChooseB==0   
            print(f"Decision in selected trial recorded: {p.bChoseA}")


class FixCross(Page):
    form_model = 'player'
    form_fields = [ 'sStartCross','sEndCross' ]
    template_name = 'global/FixCross.html'


class SideButton(Page):
    form_model = 'player'
    form_fields = [ 'sStartCross','sEndCross' ]
    template_name = 'global/SideButton.html'

    @staticmethod
    def js_vars(player: Player):
        
        return dict(
            sPosition = player.sBetweenBtn
        )


class Confidence(Page):
    form_model      = 'player'
    form_fields     = [ 'sStartConf','sEndConf', 'dRT_conf','iConfidence']
    template_name   = 'global/Confidence.html'
    
    @staticmethod
    def vars_for_template(player: Player):
        p = player.participant
        return dict(
            lScale = list(range(1,C.iLikertConf+1))
        )



page_sequence = [SideButton, Decision, Confidence]