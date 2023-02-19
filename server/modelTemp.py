import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn import svm
import joblib

from sklearn.metrics import r2_score


yield_df_onehot = pd.get_dummies(yield_df, columns=['Area',"Item"], prefix = ['Country',"Item"])
features=yield_df_onehot.loc[:, yield_df_onehot.columns != 'hg/ha_yield']
label=yield_df['hg/ha_yield']
features.head()
# shift data to train forecast model
forecast = 1
# predict the yield for the next year
features['Year'] = features['Year'].shift(-forecast)

# drop the last row of data
features.dropna(inplace=True)
features.head()

train_data, test_data, train_labels, test_labels = train_test_split(features, label, test_size=0.3, random_state=42)


def compare_models(model):
    model_name = model.__class__.__name__
    fit=model.fit(train_data,train_labels)
    y_pred=fit.predict(test_data)
    # save model weights
    joblib.dump(fit, f'model{model_name}.pkl')
            
    r2=r2_score(test_labels,y_pred)
    return([model_name,r2])


models = [
    GradientBoostingRegressor(n_estimators=200, max_depth=3, random_state=0),
     RandomForestRegressor(n_estimators=200, max_depth=3, random_state=0),
    svm.SVR(),
   DecisionTreeRegressor()
]

model_train=list(map(compare_models,models)) 

print(*model_train, sep = "\n")

# deploy model
model.load(joblibFile)
# predict off input data of region, year, month, day, and hour
prediction = model.predict(input_data)

#save teset_df to csv file
test_df.to_csv('test.csv', index=False)