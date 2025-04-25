# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class Administrateur(models.Model):
    id_utilisateur = models.OneToOneField('Utilisateur', models.DO_NOTHING, db_column='id_utilisateur', primary_key=True)

    class Meta:
        managed = True
        db_table = 'administrateur'


class Ap(models.Model):
    id_ap = models.AutoField(primary_key=True)
    montant_ap = models.DecimalField(max_digits=65, decimal_places=30, blank=True, null=True)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ap'


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


class AuthtokenToken(models.Model):
    key = models.CharField(primary_key=True, max_length=40)
    created = models.DateTimeField()
    user = models.OneToOneField(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'authtoken_token'


class Chefprojet(models.Model):
    id_utilisateur = models.OneToOneField('Utilisateur', models.DO_NOTHING, db_column='id_utilisateur', primary_key=True)

    class Meta:
        managed = False
        db_table = 'chefprojet'


class Directeur(models.Model):
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
    titre = models.CharField(max_length=30)
    date_ajout = models.DateField()
    description = models.CharField(max_length=30)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    id_sous_projet = models.ForeignKey('SousProjet', models.DO_NOTHING, db_column='id_sous_projet', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'document'


class Employe(models.Model):
    id_utilisateur = models.OneToOneField('Utilisateur', models.DO_NOTHING, db_column='id_utilisateur', primary_key=True)
    id_sous_projet = models.ForeignKey('SousProjet', models.DO_NOTHING, db_column='id_sous_projet', blank=True, null=True)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'employe'


class EtatDavancementDeprojet(models.Model):
    id_etat = models.AutoField(primary_key=True)
    type_etat = models.CharField(max_length=15)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    date_prevu = models.DateField(blank=True, null=True)
    date_realiser = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'etat_davancement_deprojet'


class Facture(models.Model):
    id_facture = models.AutoField(primary_key=True)
    numero_facture = models.IntegerField(blank=True, null=True)
    designation = models.CharField(max_length=300, blank=True, null=True)
    date_facturation = models.DateField(blank=True, null=True)
    date_reception = models.DateField(blank=True, null=True)
    brut_ht = models.DecimalField(max_digits=65, decimal_places=30, blank=True, null=True)
    montant_net_ht = models.DecimalField(max_digits=65, decimal_places=30, blank=True, null=True)
    montant_tva = models.DecimalField(max_digits=65, decimal_places=30, blank=True, null=True)
    montant_ttc = models.DecimalField(max_digits=65, decimal_places=30, blank=True, null=True)
    date_ordre_virement = models.DateField(blank=True, null=True)
    numero_ordre_virement = models.IntegerField(blank=True, null=True)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    id_sous_projet = models.ForeignKey('SousProjet', models.DO_NOTHING, db_column='id_sous_projet', blank=True, null=True)
    id_marche = models.ForeignKey('Marche', models.DO_NOTHING, db_column='id_marche', blank=True, null=True)
    id_ap = models.ForeignKey(Ap, models.DO_NOTHING, db_column='id_ap', blank=True, null=True)
    id_md = models.ForeignKey('MaitreDoeuve', models.DO_NOTHING, db_column='id_md', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'facture'


class Financier(models.Model):
    etat_financier = models.CharField(max_length=50)
    id_utilisateur = models.OneToOneField('Utilisateur', models.DO_NOTHING, db_column='id_utilisateur', primary_key=True)
    id_reunion = models.ForeignKey('Reunion', models.DO_NOTHING, db_column='id_Reunion', blank=True, null=True)  # Field name made lowercase.
    id_sous_projet = models.ForeignKey('SousProjet', models.DO_NOTHING, db_column='id_sous_projet', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'financier'


class Fournisseur(models.Model):
    id_fournisseur = models.AutoField(primary_key=True)
    non_fournisseur = models.CharField(max_length=30, blank=True, null=True)
    prenom_fournisseur = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fournisseur'


class Incident(models.Model):
    id_incident = models.AutoField(primary_key=True)
    description_incident = models.CharField(max_length=2000)
    date_incident = models.DateField()
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    id_sous_projet = models.ForeignKey('SousProjet', models.DO_NOTHING, db_column='id_sous_projet', blank=True, null=True)
    lieu_incident = models.CharField(max_length=30, blank=True, null=True)
    signale_par = models.CharField(max_length=50, blank=True, null=True)
    lheure_incident = models.TimeField(blank=True, null=True)
    type_incident = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'incident'


class MaitreDoeuve(models.Model):
    id_md = models.AutoField(primary_key=True)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    nom_fournisseur = models.CharField(max_length=30, blank=True, null=True)
    prenom_fournisseur = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'maitre_doeuve'


class MaitreOuvrage(models.Model):
    id_mo = models.AutoField(primary_key=True)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    description_mo = models.CharField(max_length=30)
    nom_mo = models.CharField(max_length=30, blank=True, null=True)
    type_mo = models.CharField(max_length=30, blank=True, null=True)
    adress_mo = models.CharField(max_length=50, blank=True, null=True)
    email_mo = models.CharField(unique=True, max_length=30, blank=True, null=True)
    tel_mo = models.CharField(unique=True, max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'maitre_ouvrage'


class Marche(models.Model):
    id_marche = models.AutoField(primary_key=True)
    date_marche = models.DateField()
    description_marche = models.CharField(max_length=100)
    id_projet = models.ForeignKey('Projet', models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    numero_marche = models.IntegerField()
    numero_appel_dof = models.IntegerField()
    visa_cme = models.CharField(max_length=30)
    date_visa_cme = models.DateField(blank=True, null=True)
    prix_da = models.DecimalField(max_digits=65, decimal_places=30, blank=True, null=True)
    prix_devise = models.DecimalField(max_digits=65, decimal_places=30, blank=True, null=True)
    type = models.CharField(max_length=30, blank=True, null=True)
    id_md = models.ForeignKey(MaitreDoeuve, models.DO_NOTHING, db_column='id_md', blank=True, null=True)
    date_notification = models.DateField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'marche'


class Projet(models.Model):
    id_projet = models.AutoField(primary_key=True)
    nom_projet = models.CharField(max_length=30)
    description_de_projet = models.CharField(max_length=30)
    date_debut_de_projet = models.DateField()
    date_fin_de_projet = models.DateField()
    statut = models.CharField(max_length=30)
    id_utilisateur = models.ForeignKey(Chefprojet, models.DO_NOTHING, db_column='id_utilisateur', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'projet'


class Reunion(models.Model):
    id_reunion = models.AutoField(primary_key=True)
    date_reunion = models.DateField(blank=True, null=True)
    ordre_de_jour = models.CharField(max_length=2000, blank=True, null=True)
    numpv_reunion = models.IntegerField(unique=True, blank=True, null=True)
    id_projet = models.ForeignKey(Projet, models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    id_utilisateur = models.ForeignKey(Chefprojet, models.DO_NOTHING, db_column='id_utilisateur', blank=True, null=True)
    heure_re = models.TimeField(blank=True, null=True)
    lieu_reunion = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'reunion'


class SousProjet(models.Model):
    id_sous_projet = models.AutoField(primary_key=True)
    nom_sous_projet = models.CharField(max_length=30)
    date_debut_sousprojet = models.DateField()
    date_finsousprojet = models.DateField()
    statut_sous_projet = models.CharField(max_length=15)
    id_projet = models.ForeignKey(Projet, models.DO_NOTHING, db_column='id_projet', blank=True, null=True)
    description_sous_projet = models.CharField(max_length=2000, blank=True, null=True)
    id_utilisateur = models.ForeignKey(Chefprojet, models.DO_NOTHING, db_column='id_utilisateur', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'sous_projet'


class SuivieSousProjet(models.Model):
    id_suivie_sous_projet = models.AutoField(primary_key=True)
    id_sous_projet = models.ForeignKey(SousProjet, models.DO_NOTHING, db_column='id_sous_projet', blank=True, null=True)
    description_suivie_sousprojet = models.CharField(max_length=100)
    date_prevu = models.DateField(blank=True, null=True)
    date_realiser = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'suivie_sous_projet'



class UtilisateurManager(BaseUserManager):
    def create_user(self, email, mot_de_passe=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(mot_de_passe)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, mot_de_passe=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, mot_de_passe, **extra_fields)

class Utilisateur(AbstractBaseUser, PermissionsMixin):
    id_utilisateur = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=100)
    nom = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    role_de_utilisateur = models.CharField(max_length=50)
    numero_de_tel = models.CharField(unique=True, max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    sexe = models.CharField(max_length=10, blank=True, null=True)
    etat = models.CharField(max_length=20, blank=True, null=True)
    prenom = models.CharField(max_length=20, blank=True, null=True)
    matricule = models.IntegerField(unique=True, blank=True, null=True)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Required by Django admin
    last_login = models.DateTimeField(blank=True, null=True)   
    objects = UtilisateurManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom', 'role_de_utilisateur']

    class Meta:
        db_table = 'utilisateur'


class Wilayas(models.Model):
    code_wilaya = models.IntegerField(unique=True)
    nom_wilaya = models.CharField(max_length=100)
    id_projet = models.ForeignKey(Projet, models.DO_NOTHING, db_column='id_projet', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'wilayas'
