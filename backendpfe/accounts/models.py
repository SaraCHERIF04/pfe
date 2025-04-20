# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class Administrateur(models.Model):
    etat_administrateur = models.CharField(db_column='etat_Administrateur', max_length=50)  # Field name made lowercase.
    id_utilisateur = models.OneToOneField('Utilisateur', models.DO_NOTHING, db_column='id_utilisateur', primary_key=True)

    class Meta:
        managed = False
        db_table = 'administrateur'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Budget(models.Model):
    id_budget = models.AutoField(primary_key=True)
    montant = models.DecimalField(max_digits=30, decimal_places=2)
    code_devise = models.ForeignKey('Devises', models.DO_NOTHING, db_column='code_devise')
    date_creation = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'budget'


class Chefprojet(models.Model):
    etat_chefprojet = models.CharField(db_column='etat_ChefProjet', max_length=50)  # Field name made lowercase.
    id_utilisateur = models.OneToOneField('Utilisateur', models.DO_NOTHING, db_column='id_utilisateur', primary_key=True)
    id_reunion = models.ForeignKey('Reunion', models.DO_NOTHING, db_column='id_Reunion', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'chefprojet'


class Commission(models.Model):
    id_commission = models.AutoField(primary_key=True)
    nom_commission = models.CharField(max_length=30)
    description_commission = models.CharField(max_length=30)
    date_commission = models.DateField()
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    statut = models.CharField(max_length=20, blank=True, null=True)
    type_commission = models.CharField(max_length=50)
    id_utilisateur = models.ForeignKey('Utilisateur', models.DO_NOTHING, db_column='id_utilisateur', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'commission'


class Devises(models.Model):
    code_devise = models.CharField(primary_key=True, max_length=3)
    nom_devise = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'devises'


class Directeur(models.Model):
    etat_directeur = models.CharField(db_column='etat_Directeur', max_length=50)  # Field name made lowercase.
    id_utilisateur = models.OneToOneField('Utilisateur', models.DO_NOTHING, db_column='id_utilisateur', primary_key=True)

    class Meta:
        managed = False
        db_table = 'directeur'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Document(models.Model):
    id_document = models.AutoField(primary_key=True)
    nom_document = models.CharField(max_length=30)
    type_document = models.CharField(max_length=30)
    date_ajout = models.DateField()
    rapport = models.CharField(max_length=30)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'document'


class Employe(models.Model):
    etat_employe = models.CharField(db_column='etat_Employe', max_length=50)  # Field name made lowercase.
    id_utilisateur = models.OneToOneField('Utilisateur', models.DO_NOTHING, db_column='id_utilisateur', primary_key=True)
    id_reunion = models.ForeignKey('Reunion', models.DO_NOTHING, db_column='id_Reunion', blank=True, null=True)  # Field name made lowercase.
    id_sous_projet = models.ForeignKey('SousProjet', models.DO_NOTHING, db_column='id_sous_projet', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'employe'


class Entreprise(models.Model):
    id_entreprise = models.AutoField(primary_key=True)
    nom_entreprise = models.CharField(max_length=30)
    adresse_entreprise = models.CharField(max_length=30)
    numer_tel_entreprise = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'entreprise'


class EtatDavancementDeprojet(models.Model):
    id_etat = models.AutoField(primary_key=True)
    type_etat = models.CharField(max_length=15)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    modifie_par = models.CharField(max_length=255, blank=True, null=True)
    raison = models.TextField(blank=True, null=True)
    date_changement = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'etat_davancement_deprojet'


class Fournisseur(models.Model):
    id_utilisateur = models.OneToOneField('Utilisateur', models.DO_NOTHING, db_column='id_utilisateur', primary_key=True)
    id_sous_projet = models.ForeignKey('SousProjet', models.DO_NOTHING, db_column='id_sous_projet', blank=True, null=True)
    id_marche = models.ForeignKey('Marche', models.DO_NOTHING, db_column='id_marche', blank=True, null=True)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fournisseur'


class Incident(models.Model):
    id_incident = models.AutoField(primary_key=True)
    description_incident = models.CharField(max_length=2000)
    date_incident = models.DateField()
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    id_suivie_incident = models.ForeignKey('SuivieIncident', models.DO_NOTHING, db_column='id_suivie_incident', blank=True, null=True)
    id_sous_projet = models.ForeignKey('SousProjet', models.DO_NOTHING, db_column='id_sous_projet', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'incident'


class MaitreOuvrage(models.Model):
    id_mo = models.AutoField(primary_key=True)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    description_mo = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'maitre_ouvrage'


class Marche(models.Model):
    id_marche = models.AutoField(primary_key=True)
    nom_marche = models.CharField(max_length=30)
    date_marche = models.DateField()
    description_marche = models.CharField(max_length=100)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    numero_marche = models.IntegerField()
    numero_appel_dof = models.IntegerField()
    visa_cme = models.CharField(max_length=30)
    date_visa_cme = models.DateField(blank=True, null=True)
    date_t0 = models.DateField(blank=True, null=True)
    id_budget = models.ForeignKey(Budget, models.DO_NOTHING, db_column='id_budget', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'marche'


class Projet(models.Model):
    id_projet = models.AutoField(primary_key=True)
    nom_projet = models.CharField(max_length=30)
    description_de_projet = models.CharField(max_length=30)
    date_debut_de_projet = models.DateField()
    date_fin_de_projet = models.DateField()
    statut = models.CharField(max_length=30)
    id_budget = models.ForeignKey(Budget, models.DO_NOTHING, db_column='id_budget', blank=True, null=True)
    wilaya = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'projet'


class Reunion(models.Model):
    id_reunion = models.AutoField(primary_key=True)
    date_reunion = models.DateField(blank=True, null=True)
    id_utilisateur = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'reunion'


class SousProjet(models.Model):
    id_sous_projet = models.AutoField(primary_key=True)
    nom_sous_projet = models.CharField(max_length=30)
    date_debut_sousprojet = models.DateField()
    date_finsousprojet = models.DateField()
    statut_sous_projet = models.CharField(max_length=15)
    id_projet = models.ForeignKey(Projet, models.DO_NOTHING, db_column='id_projet', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sous_projet'


class SuivieIncident(models.Model):
    id_suivie_incident = models.AutoField(primary_key=True)
    description_suivie_incident = models.CharField(max_length=2000)

    class Meta:
        managed = False
        db_table = 'suivie_incident'


class SuivieSousProjet(models.Model):
    id_suivie_sous_projet = models.AutoField(primary_key=True)
    id_sous_projet = models.ForeignKey(SousProjet, models.DO_NOTHING, db_column='id_sous_projet', blank=True, null=True)
    description_suivie_sousprojet = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'suivie_sous_projet'


class UtilisateurManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)

class Utilisateur(models.Model):
    id_utilisateur = models.AutoField(primary_key=True)
    nom = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=100)
    mot_de_passe = models.CharField(max_length=255)
    role_de_utilisateur = models.CharField(max_length=50)
    numero_de_tel = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    is_anonymous = models.BooleanField(default=False)
    is_authenticated = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)


    USERNAME_FIELD = 'email'    
    REQUIRED_FIELDS = ['nom', 'role_de_utilisateur', 'numero_de_tel']
    objects = UtilisateurManager()
    class Meta:
        managed = False
        db_table = 'utilisateur'

    def get_user_id(self):
        return self.id_utilisateur
