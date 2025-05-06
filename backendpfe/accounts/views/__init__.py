from .project_view import ProjectView
from .document_view import DocumentView
from .incident_view import IncidentView
from .meeting_view import MeetingView
from .ap_view import ApView  # Remplacer BudgetView par ApView
from .sub_project_view import SubProjectView
from .auth_views import AuthView
from .facture_view import FactureView
from .user_view import UserView
from .employer_view import EmployerView
from .financier_view import FinancierView

all = [
    'ProjectView',
    'DocumentView',
    'IncidentView',
    'MeetingView',
    'ApView',  # Ajout de ApView
    'SubProjectView',
    'AuthView',
    'FactureView',
    'UserView',
    'EmployerView'
]
