from django.http import HttpResponse
import json
import joblib
import sklearn
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
    print(predictions)
    # send it over to frontend as json
    return HttpResponse(json.dumps(predictions), content_type="application/json")