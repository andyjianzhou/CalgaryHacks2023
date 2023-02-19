from django.http import HttpResponse
import json
import joblib
import sklearn
import pandas as pd
import csv
def index(request):
    model_path = "./modelDecisionTreeTes.pkl"
    model = joblib.load(model_path)
    # The input of a Decision Tree Regressor to predict the crop yield is a list of 5 values, in the following order:
    # 1. Temperature
    # 2. Humidity
    # 3. Soil Moisture
    # 4. Soil pH
    # 5. Rainfall
    
    # forecase the crop yield for the following values:
    print(model.feature_names)
    predictions = model.predict([request])
    
    
    pred_df = pd.DataFrame('LivePreds/preds.csv')
    json_preds = pred_df.to_json('LivePreds/preds.json')
    # create API response and send it to the frontend
    response = HttpResponse(json_preds, content_type='application/json')
    response['Access-Control-Allow-Origin'] = '*'
    return response
