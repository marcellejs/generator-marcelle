import { Dataset } from '@marcellejs/core';
import { DatasetInfo } from './dataset-info.module';

export function datasetInfo(dataset: Dataset): DatasetInfo {
  return new DatasetInfo(dataset);
}

export type { DatasetInfo };
