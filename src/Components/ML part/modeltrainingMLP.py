import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split 

data = pd.read_csv('/Users/alkadeviukrani/Downloads/framingham.csv')


#irrelvant column 
data = data.drop(columns=['education'])


#drop missing value
data = data.dropna(subset=['TenYearCHD'])


# "inplace" typically refers to operations that modify an object directly without creating a new object, np.nan means undefined value 
data.replace(["N/A", "na", ""], np.nan, inplace=True)

#removing missing values 
# data = data.dropna(subset=['NR-ER', 'SR-ARE', 'SR-MMP', 'smiles'])

#handling suspcisous zeros in some columns 

for col in ['totChol', 'sysBP', 'diaBP', 'BMI', 'heartRate', 'glucose']:
    data[col]=data[col].replace(0, np.nan)
    

#handle missing values by imputing median
# For continuous variables
continuous_cols = ['age', 'cigsPerDay', 'totChol', 'sysBP', 'diaBP', 'BMI', 'heartRate', 'glucose']
for col in continuous_cols:
    data[col] = data[col].fillna(data[col].median())




X=data[['male', 'age', 'currentSmoker', 'cigsPerDay', 'BPMeds',
            'prevalentStroke', 'prevalentHyp', 'diabetes', 'totChol', 'sysBP',
            'diaBP', 'BMI', 'heartRate', 'glucose']]
y = data["TenYearCHD"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=1, shuffle=True, stratify=y )

#validation set
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.1, random_state=1, shuffle=True, stratify=y)

#Implementing MLP model 

import torch

class PyTorchMLP(torch.nn.Module):
    def __init__(self,num_features, num_classes):
        super().__init__()
        
        self.all_layer = torch.nn.Sequential(
            
            #1st hidden layer
            torch.nn.Linear(num_features, 25),
            torch.nn.ReLU(),
            
            #2nd hidden layer 
            torch.nn.Linear(25, 15),
            torch.nn.ReLU(),
            
            #output layer
            torch.nn.Linear(15,num_classes),
          
            
        )
    
    def forward(self,x):
        logits=self.all_layers(x)
        return logits
    
    


from torch.utils.data import Dataset, dataloader

class MyDataset(Dataset):
    
    # Constructor method: The torch.tensor function converts X and y into PyTorch tensors:
    def __init__(self, X,y):
        self.features=torch.tensor(X, dtype=torch.float32)
        self.labels = torch.tensor(y, dtype=torch.int64)
    
    
    #This method allows you to access a specific data point (sample) in the dataset by its index.
    
    def __getitem__(self, index):
        x=self.features[index]
        y=self.labels[index]
        return x, y
    
    #This method returns the total number of samples in the dataset.
    def __len__(self):
        return self.labels.shape[0]



train_ds=MyDataset(X_train, y_train)
val_ds=MyDataset(X_val, y_val)
test_ds=MyDataset(X_test, y_test)



train_loader = DataLoader(
    dataset=train_ds,
    batch_size=32,
    shuffle=True,
)

val_loader = DataLoader(
    dataset=val_ds,
    batch_size=32,
    shuffle=False,
)

test_loader = DataLoader(
    dataset=test_ds,
    batch_size=32,
    shuffle=False,
)

# print ("Training size:", X_train.shape)
# print ("Validation size:", X_val.shape)
# print ("Testing size:" ,X_test.shape)










