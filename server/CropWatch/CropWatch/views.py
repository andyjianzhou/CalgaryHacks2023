from django.http import HttpResponse
from django.http import JsonResponse
import json
import joblib
import sklearn
import pandas as pd
import csv
import requests
import xml.etree.ElementTree as ET
import pprint

def index(request):
    # model_path = 'C://Users//YOLO4\OneDrive\Desktop\CMPUT175\CalgaryHacks2023\server\CropWatch\CropWatch\LivePreds\modelDecisionTreeTest.pkl'
    # model = joblib.load(model_path)
    # The input of a Decision Tree Regressor to predict the crop yield is a list of 5 values, in the following order:
    # 1. Temperature
    # 2. Humidity
    # 3. Soil Moisture
    # 4. Soil pH
    # 5. Rainfall
    
    # forecase the crop yield for the following values:
    # print(model.feature_names)
    # predictions = model.predict([request])
    
    pred_df = pd.read_csv('CropWatch/CropWatch/LivePreds/preds.csv')
    json_preds = pred_df.to_json('CropWatch/CropWatch/LivePreds/preds.json')
    # create API response and send it to the frontend
    response = HttpResponse(json_preds, content_type='application/json')
    response['Access-Control-Allow-Origin'] = '*'
    return response


def get_export_partners(request):
    regionCodes = ["WLD", "NAC", "ECS", "EAS", "LCN", "SSF", "SAS", "MEA"]
    print("CONNECTEDDDD")
    try:
        country_code = request.GET.get("country_code")
        response = requests.get(f"http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/reporter/{country_code}/year/2018/partner/all/product/food/indicator/XPRT-TRD-VL")
        # pprint.pprint(response.content)
        root = ET.fromstring(response.content)
        pprint.pprint(root)
        resulting_data = []
        for series in root.findall(".//Series"):
            partner_code = series.get("PARTNER")
            if partner_code not in regionCodes:
                obs_value = series.find(".//Obs[@OBS_VALUE]")
                resulting_data.append({"country": partner_code, "value": obs_value.get("OBS_VALUE")})
        resulting_data.sort(key=lambda x: x["value"], reverse=True)
        resulting_data = resulting_data[:3]
        for element in resulting_data:
            response = requests.get(f"http://wits.worldbank.org/API/V1/wits/datasource/tradestats-trade/country/{element['country']}")
            root = ET.fromstring(response.content)
            element["country"] = root.findtext(".//wits:name")
        return JsonResponse(resulting_data, safe=False)
    except Exception as error:
        print(error)
        return JsonResponse({"error": str(error)}, status=500)

def get_import_partners(request):
    regionCodes = ["WLD", "NAC", "ECS", "EAS", "LCN", "SSF", "SAS", "MEA"]
    print("CONNECTEDDDD")
    try:
        country_code = request.GET.get("country_code")
        response = requests.get(f"http://wits.worldbank.org/API/V1/SDMX/V21/datasource/tradestats-trade/reporter/{country_code}/year/2018/partner/all/product/food/indicator/MPRT-TRD-VL")
        # pprint.pprint(response.content)
        root = ET.fromstring(response.content)
        pprint.pprint(root)
        resulting_data = []
        for series in root.findall(".//Series"):
            partner_code = series.get("PARTNER")
            if partner_code not in regionCodes:
                obs_value = series.find(".//Obs[@OBS_VALUE]")
                resulting_data.append({"country": partner_code, "value": obs_value.get("OBS_VALUE")})
        resulting_data.sort(key=lambda x: x["value"], reverse=True)
        resulting_data = resulting_data[:3]
        for element in resulting_data:
            response = requests.get(f"http://wits.worldbank.org/API/V1/wits/datasource/tradestats-trade/country/{element['country']}")
            root = ET.fromstring(response.content)
            element["country"] = root.findtext(".//wits:name")
        return JsonResponse(resulting_data, safe=False)
    except Exception as error:
        print(error)
        return JsonResponse({"error": str(error)}, status=500)


