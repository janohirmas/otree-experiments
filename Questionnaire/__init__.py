from otree.api import *
import json 
import time

doc = """
Your app description
"""


class C(BaseConstants):
    NAME_IN_URL = 'Questionnaire'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1
    # File location
    sQuestPath = '_static/global/files/questions.json'
    # Message
    sMessage = 'The main task of the experiment has ended. Now we will ask you to answer a brief questionnaire. After the questionnaire we will inform you if you have been selected for the bonus payment.'
    # Questions 
    text_file = open(sQuestPath)
    lQuestions = json.load(text_file)['lQuestions']
    lNames      = []
    lNamesQ    = []
    lVars       = []
    for i in range(len(lQuestions)):
        name  = f"Q_{lQuestions[i]['name']}"
        bIsQ  = lQuestions[i]['name'] !=''
        if lQuestions[i].get('blank'):
            bBlank = True
        else:
            bBlank = False
        lNames.append(name)
        if bIsQ:
            lNamesQ.append(name)
            lVars.append([name,bBlank])
        


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    iCorrect = models.IntegerField()

for i in range(len(C.lVars)):
    name, bBlank = C.lVars[i]
    setattr(Player, name, models.StringField(blank=bBlank))



# PAGES
class Questionnaire(Page):
    template_name = 'global/Questionnaire.html'

    form_model = 'player'
    lFields = C.lNamesQ[:]
    # lFields.append('iCorrect')
    form_fields = lFields


    @staticmethod
    def js_vars(player: Player):
        
        return dict(
            lQuestions = C.lQuestions,
            sBodyName = 'page-content',
        )

    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        pass 
        # If you need to store something here for the results page, do it here.


class EndMessage(Page):
    template_name = 'global/Message.html'

    @staticmethod
    def vars_for_template(player: Player):
        return dict(
            MessageText = C.sMessage
        )
    
page_sequence = [EndMessage,Questionnaire]
