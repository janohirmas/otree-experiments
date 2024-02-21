from otree.api import *
import random
from Instructions import C as CG

doc = """
Your app description
"""


class C(BaseConstants):
    NAME_IN_URL = 'InformedConsent'
    PLAYERS_PER_GROUP   = None
    NUM_ROUNDS          = 1
    # TimeOut Seconds 
    timeout_seconds = 0 # Amount of seconds before timeout. If 0, no timeout
    # Template variables
    AvgDur              = '30'
    # Figures paths
    figUvA_logo         = 'global/figures/UvA_logo.png'


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    pass

def randomString(iN=10):
    lChars = ['a','b','c','d','e','f','g','h','i','j','k','l','m',
              '1','2','3','4','5','6','7','8','9','0','x','y','z']
    return ''.join(random.choices(lChars,k=iN))

# PAGES

class Intro(Page):
    form_model = 'player'
    form_fields = []

    if C.timeout_seconds>0:
        timeout_seconds = C.timeout_seconds

    @staticmethod
    def before_next_page(player: Player, timeout_happened):

        if timeout_happened:
            player.participant.bTimeout = True

        sLabel = player.participant.label
        if sLabel==None:
            player.participant.label = randomString()
    
class TimeOut(Page):
    form_model = 'player'
    form_fields = []

    @staticmethod
    def is_displayed(player: Player):
        return player.participant.bTimeout
    
    @staticmethod
    def js_vars(player: Player):
        return dict(
            sLinkReturn = CG.sLinkReturn,
        )

page_sequence = [Intro, TimeOut]
