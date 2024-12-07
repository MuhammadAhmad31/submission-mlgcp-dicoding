const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
const getAllData = require('../services/getAllData');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    const { model } = request.server.app;

    const { label, suggestion } = await predictClassification(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        id,
        result: label,
        suggestion,
        createdAt,
    };

    await storeData(id, data);

    return h
        .response({
            status: 'success',
            message: 'Model is predicted successfully',
            data,
        })
        .code(201);
}

async function postPredictHistoriesHandler(request, h) {
    const allData = await getAllData();

    const formatAllData = allData.map((doc) => ({
        id: doc.id,
        history: {
            result: doc.data().result,
            createdAt: doc.data().createdAt,
            suggestion: doc.data().suggestion,
            id: doc.id,
        },
    }));

    return h
        .response({
            status: 'success',
            data: formatAllData,
        })
        .code(200);
}

module.exports = { postPredictHandler, postPredictHistoriesHandler };
