import '@marcellejs/core/dist/bundle.css';
import {
  browser,
  webcam,
  mobilenet,
  dataset,
  button,
  parameters,
  progress,
  toggle,
  mlp,
  createBackend,
  dashboard,
  textfield,
  trainingPlot,
  batchPrediction,
  confusion,
  predictionPlot,
  account,
} from '@marcellejs/core';
import { datasetInfo } from './modules';

// -----------------------------------------------------------
// INPUT PIPELINE & DATA CAPTURE
// -----------------------------------------------------------

const input = webcam();
const featureExtractor = mobilenet();

const label = textfield();
label.name = 'Instance label';
const capture = button({ text: 'Hold to record instances' });
capture.name = 'Capture instances to the training set';

const instances = input.$images
  .filter(() => capture.$down.value)
  .map(async img => ({
    type: 'image',
    data: img,
    label: label.$text.value,
    thumbnail: input.$thumbnails.value,
    features: await featureExtractor.process(img),
  }))
  .awaitPromises();

const backend = createBackend({ location: <% if (backend === 'browser') { %>'localStorage'<% } else { %>'http://localhost:3030'<% } %> });
const trainingSet = dataset({ name: 'TrainingSet', backend });
trainingSet.capture(instances);

const trainingSetBrowser = browser(trainingSet);
const trainingSetInfo = datasetInfo(trainingSet);

// -----------------------------------------------------------
// TRAINING
// -----------------------------------------------------------

const b = button({ text: 'Train' });
b.name = 'Training Launcher';
const classifier = mlp({ layers: [64, 32], epochs: 20 });
b.$click.subscribe(() => classifier.train(trainingSet));

const params = parameters(classifier);
const prog = progress(classifier);
const plotTraining = trainingPlot(classifier);

// -----------------------------------------------------------
// BATCH PREDICTION
// -----------------------------------------------------------

const batchMLP = batchPrediction({ name: 'mlp', backend });
const confusionMatrix = confusion(batchMLP);

const predictButton = button({ text: 'Update predictions' });
predictButton.$click.subscribe(async () => {
  await batchMLP.clear();
  await batchMLP.predict(classifier, trainingSet);
});

// -----------------------------------------------------------
// REAL-TIME PREDICTION
// -----------------------------------------------------------

const tog = toggle({ text: 'toggle prediction' });

const predictionStream = input.$images
  .filter(() => tog.$checked.value)
  .map(async img => classifier.predict(await featureExtractor.process(img)))
  .awaitPromises();

const plotResults = predictionPlot(predictionStream);

// -----------------------------------------------------------
// DASHBOARDS
// -----------------------------------------------------------

const dashboard = dashboard({
  title: 'Marcelle Example - Dashboard',
  author: 'Marcelle Pirates Crew',
});

dashboard
  .page('Data Management')
  .useLeft(input, featureExtractor)
  .use([label, capture], trainingSetInfo, trainingSetBrowser);
dashboard.page('Training').use(params, b, prog, plotTraining);
dashboard.page('Batch Prediction').use(predictButton, confusionMatrix);
dashboard.page('Real-time Prediction').useLeft(input).use(tog, plotResults);
dashboard.settings.useLeft(account(backend)).use(trainingSet);

dashboard.start();
