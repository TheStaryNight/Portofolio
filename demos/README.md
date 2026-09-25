# Portfolio demos

The portfolio includes browser demos for Fruit Classification, Gesture Mouse, and CatatStock. PlayNest is unchanged.

## Build and publish

Run `npm ci` at the repository root, then `npm run build`. This also installs/builds the isolated CatatStock frontend and copies pinned inference runtime files. Deploy `dist/` as the existing Astro static site (for example on Vercel). No Python server or external inference API is needed. Camera input requires HTTPS or localhost. These routes are local until the portfolio is deployed.

- `/demos/fruit/`: actual trained ResNet18 weights exported to ONNX. First prediction downloads approximately 45 MB. RGB images are resized to 224x224 and normalized with ImageNet mean/std. Browser resizing can differ slightly from Pillow. Classification is a student demonstration, not a food-safety assessment.
- `/demos/gesture/`: MediaPipe hand tracking plus the project's exported Random Forest. Camera stays off until requested and stops when leaving/hiding the tab. No video upload. A recorded-landmark test works without camera permission; it is explicitly a training-sample test, not evidence of generalization. Browser controls are limited to the playground.
- `/demos/catatstock/`: adapted original React UI with an in-memory API replacement, four fictional inventory products, and local transaction updates. Reload resets changes. No login, production database, or production API access. AI forecasting and barcode decoding are unavailable in this showcase; the banner identifies it as sample data.

## Model provenance

Fruit source: user's `Fruit-Clasification/saved_models/best_fruit_model.pth`, exported with PyTorch 2.4.1 and ONNX opset 17. Class ordering is saved beside the model in `fruit-classes.json`.

Gesture source: user's `KOMVIS/gesture_model.pkl`, a RandomForestClassifier. Each tree's thresholds, child indices, and normalized class probabilities are serialized to JSON. Float32 features use wrist-relative xy coordinates divided by the largest landmark distance. Exported evaluation agreed with sklearn on 100 saved feature rows. Loading emitted a sklearn 1.9.0/1.6.1 version warning; equivalence was checked on those rows only. Four recorded samples are included for the no-camera test. `hand_landmarker.task` is the existing MediaPipe model from the project.

CatatStock source: https://github.com/ercenttannius123/CatatStock . Original frontend contributors retain credit; this portfolio adapter changes the data layer and demo entry flow, not authorship of the original app.

Implementation references: [MediaPipe web Hand Landmarker](https://developers.google.com/edge/mediapipe/solutions/vision/hand_landmarker/web_js) and [ONNX Runtime Web](https://onnxruntime.ai/docs/get-started/with-javascript/web.html).

Models under `public/demos/models/` are public browser assets when deployed. Runtime binaries and generated CatatStock bundles are generated at build time; do not edit them directly. The main portfolio does not load model weights until a visitor opens a demo and requests inference.
