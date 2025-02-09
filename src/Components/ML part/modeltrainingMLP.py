import pandas as pd
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from sklearn.model_selection import train_test_split 
from sklearn.preprocessing import RobustScaler

torch.autograd.set_detect_anomaly(True)  # NEW: ENABLED ANOMALY DETECTION

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

# PRINT UNIQUE TARGET VALUES TO VERIFY
print("UNIQUE TARGET VALUES:", y.unique())

# NORMALIZE THE FEATURES WITH ROBUSTSCALER (NEW)
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)
X = pd.DataFrame(X_scaled, columns=X.columns)
print("ANY NANs IN X?", X.isnull().values.any())
print("ANY INFs IN X?", np.isinf(X.values).any())
print("FEATURE STATISTICS:\n", X.describe())

# CHECK FOR NaNs AND DROP ROWS IF NECESSARY (NEW)
if X.isnull().values.any():
    X = X.dropna()
    y = y.loc[X.index] # ALIGN THE TARGET WITH THE UPDATED FEATURE INDEX

# OPTIONAL: PRINT STD DEV TO CHECK FOR CONSTANT COLUMNS (NEW)



# First split into training+validation and test sets
X_train_val, X_test, y_train_val, y_test = train_test_split(
    X, y, test_size=0.15, random_state=1, shuffle=True, stratify=y
)

# Then split the training+validation set into training and validation sets
X_train, X_val, y_train, y_val = train_test_split(
    X_train_val, y_train_val, test_size=0.1, random_state=1, shuffle=True, stratify=y_train_val
)


#Implementing MLP model 

import torch

class SimpleMLP(torch.nn.Module):
    def __init__(self, num_features, num_classes):
        super(SimpleMLP, self).__init__()
        self.fc1 = torch.nn.Linear(num_features, 16)
        self.relu = torch.nn.ReLU()
        self.fc2 = torch.nn.Linear(16, num_classes)
        # NEW: INITIALIZE WEIGHTS WITH XAVIER UNIFORM
        torch.nn.init.xavier_uniform_(self.fc1.weight)
        torch.nn.init.zeros_(self.fc1.bias)
        torch.nn.init.xavier_uniform_(self.fc2.weight)
        torch.nn.init.zeros_(self.fc2.bias)
    
    def forward(self, x):
        out = self.fc1(x)
        out = self.relu(out)
        out = self.fc2(out)
        return out

# USE THE SIMPLE MODEL
num_features = X_train.shape[1]
num_classes = len(y_train.unique())
model = SimpleMLP(num_features=num_features, num_classes=num_classes)

    




class MyDataset(Dataset):

    def __init__(self, X, y):
        # CONVERT DATA TO TENSORS; ENSURE LABELS ARE LONG (INTEGER)
        self.features = torch.tensor(X.values, dtype=torch.float32)
        self.labels = torch.tensor(y.values, dtype=torch.long)
    
    def __getitem__(self, index):
        return self.features[index], self.labels[index]
    
    def __len__(self):
        return len(self.labels)

# CREATE DATASETS AND DATALOADERS (NEW: REDUCED BATCH SIZE TO 16)
train_ds = MyDataset(X_train, y_train)
val_ds = MyDataset(X_val, y_val)
test_ds = MyDataset(X_test, y_test)

train_loader = DataLoader(train_ds, batch_size=16, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=16, shuffle=False)
test_loader = DataLoader(test_ds, batch_size=16, shuffle=False)

# print ("Training size:", X_train.shape)
# print ("Validation size:", X_val.shape)
# print ("Testing size:" ,X_test.shape)

#Training the model 

def compute_accuracy(model, dataloader):
    
    model = model.eval() #tells MLP to switch to evaluate model 
    
    
    correct =0.0 #will count #of correct predictions
    total_examples = 0 #total number of data examples processed
    
    
    
    #iterating over dataloader one batch at a time, each batch provides a set of features(inputs) and their true outputs(labels) then making predictions with the model 

    for idx, (features,labels) in enumerate(dataloader):
    
#ensures no gradient are computed (saves memory)    
        with torch.inference_mode():
            #passes the input features through model to get raw prediction scores
            logits = model(features) # making predictions with the model -returning logits
        
        
        #turning them into class labels finds the index of the highest score in each set of logits, which corresponds to the predicted class label.
        predictions = torch.argmax(logits, dim=1)
        
        #creates a tensor that shows whether each prediction is correct (True) or not (False).
        
        compare=labels == predictions
        correct += torch.sum(compare)#adds up all correct predictions in batch
        total_examples +=len(compare)
        #The number of correct predictions and the total number of examples are updated for each batch.
        
        
    #returns accuracy of this ration
    return correct / total_examples 









#training loop


import torch.nn.functional as F



torch.manual_seed(1)
# After splitting your dataset
print("Training size:", X_train.shape)
print("Validation size:", X_val.shape)
print("Testing size:" ,X_test.shape)

# Determine number of features and classes dynamically
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)

num_epochs = 10
torch.manual_seed(1)
import torch.nn.functional as F

# TRAINING LOOP
for epoch in range(num_epochs):
    model.train()
    for batch_idx, (features, labels) in enumerate(train_loader):
        logits = model(features)
        
        with torch.inference_mode():
            logits_debug = model(features)
        print("DEBUG: Logits Min:", logits_debug.min().item(), "Max:", logits_debug.max().item())
        loss = F.cross_entropy(logits, labels)
        
        optimizer.zero_grad()
        loss.backward()
        # NEW: APPLY GRADIENT CLIPPING WITH A TIGHTER THRESHOLD (MAX_NORM=0.1)
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=0.5)
        
        # NEW: PRINT GRADIENT NORM FOR DEBUGGING
        grad_norm = 0.0
        for param in model.parameters():
            if param.grad is not None:
                grad_norm += param.grad.data.norm(2).item() ** 2
        grad_norm = grad_norm ** 0.5
        print(f"DEBUG: Gradient Norm: {grad_norm:.4f}")
        
        optimizer.step()
        
        # NEW: DEBUG CHECK FOR NaN/INF IN PARAMETERS
        for name, param in model.named_parameters():
            if torch.isnan(param).any() or torch.isinf(param).any():
                print(f"WARNING: PARAMETER {name} HAS NAN OR INF!")
        
        print(f"Epoch:{epoch+1:03d}/{num_epochs:03d} | Batch:{batch_idx:03d}/{len(train_loader):03d} | Loss:{loss.item():.2f}")
        
    # COMPUTE AND PRINT ACCURACY AFTER EACH EPOCH
    train_acc = compute_accuracy(model, train_loader)
    val_acc = compute_accuracy(model, val_loader)
    print(f"Epoch {epoch+1:03d} => Train Acc {train_acc*100:.2f}% | Val Acc {val_acc*100:.2f}%")

# FINAL ACCURACY ON TRAIN, VALIDATION, AND TEST SETS
train_acc = compute_accuracy(model, train_loader)
val_acc = compute_accuracy(model, val_loader)
test_acc = compute_accuracy(model, test_loader)

print(f"Train Acc: {train_acc*100:.2f}%")
print(f"Val Acc: {val_acc*100:.2f}%")
print(f"Test Acc: {test_acc*100:.2f}%")

