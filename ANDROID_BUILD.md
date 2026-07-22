# MCSF Android — Build & Play Store Guide

Ton app est déjà wrappée avec **Capacitor** (`appId: app.mcsf.togo`). Le projet Android natif vit dans `android/` et charge la PWA publiée (`https://mcsf-togo.lovable.app`). Le workflow GitHub Actions `.github/workflows/android.yml` produit automatiquement APK + AAB signés, vérifie les signatures, et publie une **GitHub Release** sur tag `v*`.

---

## 1. Génération du keystore (une seule fois, en local)

Play Store impose une clé RSA 2048+ valide au minimum 25 ans (choisis 10000 jours).

```bash
keytool -genkey -v \
  -keystore mcsf-release.keystore \
  -alias mcsf \
  -keyalg RSA -keysize 2048 -validity 10000
```

**⚠️ Sauvegarde ce fichier + les mots de passe dans un gestionnaire de mots de passe.** Si tu le perds, tu ne pourras plus publier de mise à jour de ton app sur Play Store.

Encode le keystore en base64 pour GitHub :

```bash
base64 -w0 mcsf-release.keystore > mcsf-release.keystore.b64
```

## 2. Configuration des secrets GitHub

Repo → **Settings → Secrets and variables → Actions → New repository secret**. Ajoute :

| Nom du secret | Valeur |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | Contenu de `mcsf-release.keystore.b64` |
| `ANDROID_KEYSTORE_PASSWORD` | Mot de passe du keystore |
| `ANDROID_KEY_ALIAS` | `mcsf` (ou l'alias choisi) |
| `ANDROID_KEY_PASSWORD` | Mot de passe de la clé |

## 3. Déclencher un build

Trois façons :

- **Push sur `main`** → build automatique, artifacts dans **Actions → dernier run → Artifacts**.
- **Manuel** → **Actions → Android Build → Run workflow** (option `release: true` pour créer aussi une GitHub Release).
- **Tag `v*`** → build + publication automatique d'une **GitHub Release** avec APK, AAB et `SHA256SUMS.txt` attachés :
  ```bash
  git tag v1.0.0 && git push origin v1.0.0
  ```

Le job `build` :
1. Installe deps + sync Capacitor.
2. Décode le keystore.
3. Compile `assembleRelease` + `bundleRelease`.
4. **Vérifie les signatures** avec `jarsigner`, `apksigner`, et **valide l'AAB avec `bundletool validate`**.
5. Renomme les artifacts (`mcsf-1.0.0-1-app-release.aab`) et calcule les `SHA256SUMS`.
6. Upload en artifact (rétention 90 j).

Le job `release` (sur tag `v*` ou dispatch avec `release=true`) publie une **GitHub Release** avec tous les fichiers.

## 4. Incrémenter la version avant chaque release

Édite `android/app/build.gradle` :

```gradle
defaultConfig {
    applicationId "app.mcsf.togo"
    versionCode 2        // +1 à chaque release Play Store
    versionName "1.0.1"  // version visible utilisateur
}
```

`versionCode` **doit** être strictement supérieur à la version précédente sur Play Console, sinon l'upload est refusé.

## 5. Publication Play Store (première fois)

1. **Créer un compte développeur** → https://play.google.com/console (frais unique de **25 $**).
2. **Créer l'application** :
   - Nom : `MCSF — Mission Christ Sans Frontière`
   - Langue par défaut : Français (France)
   - App ou jeu : App · Gratuit ou payant : Gratuit
3. **Fiche du Store** (onglet *Grow → Main store listing*) :
   - Description courte (80 car.) et complète (4000 car.)
   - **Icône** 512×512 PNG · **Feature graphic** 1024×500 PNG
   - **Captures d'écran** : min 2 pour téléphone (min 320 px, max 3840 px)
   - Catégorie : *Books & Reference* ou *Lifestyle*
   - Email de contact + **URL politique de confidentialité** (obligatoire)
4. **Content rating** → questionnaire IARC.
5. **Data safety** → déclare la collecte (auth email, contenu utilisateur du forum).
6. **Target audience** → 13+ recommandé.
7. **App content** → publicités (non), accès restreint (non), etc.
8. **Production release** :
   - *Release → Production → Create new release*
   - **App integrity** : *Play App Signing* activé (recommandé Google) — upload ton AAB signé, Google re-signe avec sa propre clé pour distribution.
   - Upload `mcsf-1.0.0-1-app-release.aab` (récupéré depuis GitHub Release).
   - Release notes en FR.
   - *Review release → Start rollout to Production*.
9. **Review Google** : 1 à 7 jours. Mises à jour ensuite ~quelques heures.

## 6. Publier une mise à jour

```bash
# 1. Bump version dans android/app/build.gradle (versionCode + versionName)
# 2. Commit + tag
git commit -am "release: v1.0.1"
git tag v1.0.1 && git push origin main --tags
# 3. Attends le workflow, télécharge l'AAB depuis la Release GitHub
# 4. Play Console → Production → Create new release → upload AAB
```

Le contenu web (pages, articles) se met à jour **instantanément** à chaque `Publish` Lovable — pas besoin de re-soumettre l'app. Ne rebuild l'AAB que pour changer l'icône, les permissions, le splash, ou le wrapper natif.

## 7. Test local avant publication

```bash
bun install
npx cap sync android
cd android
./gradlew bundleRelease           # AAB → app/build/outputs/bundle/release/
./gradlew installDebug            # installe sur appareil branché en USB
```

Prérequis local : Java 21 + Android SDK (Android Studio recommandé).

## 8. Vérifier un AAB téléchargé (optionnel)

```bash
# Signature
jarsigner -verify -verbose:summary app-release.aab

# Validation Play Store
curl -L -o bundletool.jar https://github.com/google/bundletool/releases/latest/download/bundletool-all-1.17.2.jar
java -jar bundletool.jar validate --bundle=app-release.aab

# Générer des APK installables depuis l'AAB (utile pour tester)
java -jar bundletool.jar build-apks --bundle=app-release.aab --output=app.apks --mode=universal
unzip -p app.apks universal.apk > app-universal.apk
adb install app-universal.apk
```

## 9. Troubleshooting

| Erreur | Cause / Fix |
|---|---|
| `Keystore was tampered with, or password was incorrect` | Mauvais `ANDROID_KEYSTORE_PASSWORD` ou base64 corrompu. Re-encode avec `base64 -w0`. |
| Play Console *"You uploaded an APK or Android App Bundle signed with a key that is also used to sign APKs delivered to users"* | Tu utilises une nouvelle clé alors que Play App Signing est déjà lié à l'ancienne. Réutilise la même keystore. |
| Play Console *"Version code X has already been used"* | Bump `versionCode` dans `android/app/build.gradle`. |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` sur appareil test | L'appareil a déjà une version signée par une autre clé — désinstalle d'abord. |
| Build vert mais AAB manquant | Vérifie que les 4 secrets `ANDROID_*` sont bien configurés — sans keystore, seul un APK debug est produit. |
