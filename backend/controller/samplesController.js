import SamplesModel from '../models/samples.js';

export const getSamples = async (req, res) => {
  try {
    const response = await SamplesModel.update(
      { name: 'Update sample'},
      { where: { _id: 1 } }
  );
    res.send(response);
  } catch (error) {
    console.log('error :>> ', error);
  }
};