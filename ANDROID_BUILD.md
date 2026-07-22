# Build Android (APK / AAB) pour Google Play

Ton app est déjà wrappée avec **Capacitor** (`app.mcsf.togo`). Le dossier `android/` contient un projet Android natif qui charge la PWA publiée (`https://mcsf-togo.lovable.app`).

## Option A — Build automatique via GitHub Actions (recommandé)

À chaque push sur `main`, le workflow `.github/workflows/android.yml` compile un **APK** et un **AAB** téléchargeables dans l'onglet **Actions → dernier run → Artifacts**.

### Pour un AAB signé (obligatoire pour Play Store)

1. Génère une keystore locale (une seule fois) :
   ```bash
   keytool -genkey -v -keystore mcsf.keystore -alias mcsf -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Encode-la en base64 :
   ```bash
   base64 -w0 mcsf.keystore > mcsf.keystore.b64
   ```
3. Dans GitHub → **Settings → Secrets and variables → Actions**, ajoute :
   - `ANDROID_KEYSTORE_BASE64` = contenu de `mcsf.keystore.b64`
   - `ANDROID_KEYSTORE_PASSWORD` = mot de passe du keystore
   - `ANDROID_KEY_ALIAS` = `mcsf`
   - `ANDROID_KEY_PASSWORD` = mot de passe de la clé
4. Re-lance le workflow → tu récupères `app-release.aab` prêt pour Play Console.

Sans secrets, tu obtiens un **APK debug** pour tester en local.

## Option B — Build en local

```bash
bun install
npx cap sync android
cd android
./gradlew bundleRelease   # AAB → android/app/build/outputs/bundle/release/
./gradlew assembleRelease # APK → android/app/build/outputs/apk/release/
```
Java 21 + Android SDK requis.

## Publication Play Store

1. Crée une fiche sur [Google Play Console](https://play.google.com/console) (25 $ une fois).
2. Upload l'AAB signé.
3. Remplis fiche (nom, description, captures, icône 512×512, bannière 1024×500, politique de confidentialité).
4. Soumets pour review.

## Mettre à jour l'app

- Contenu (web) : chaque `Publish` sur Lovable met à jour l'app instantanément (elle charge la PWA distante).
- Native (icône, permissions, wrapper) : incrémente `versionCode`/`versionName` dans `android/app/build.gradle` puis rebuild.
