#### Overview

Mental health is a taboo topic and often people don't open up their problems with others, through this website users can evaluate their situation without a third party. 

**DivorcePRED** offers an end to end solution from predicting the state of marriage with the help of machine learning, finding like minded people through clustering, emotional analysis through natural language processing and finding optimal routes and therapy centres through graph algorithms.

 <p align="center">
 <img src="https://github.com/VaibhaveS/AI_project/blob/main/proj/static/Mental%20health%20with%20AI.gif">
 </p>

<a name="installation">
 
#### Installation
 
```sh
$ cd to project location and activate virtual env using "venv\scripts\activate"  
```

```sh
$ Install flask using pip with command "pip install flask flask-sqlalchemy" 
```
```sh
$ Run using "python run.py"
```

<!-- #### Alternative



```sh 
$ go to the project directory
 ```

```sh 
$ pip install virtualenv </li>
```
```sh 
$ py -3 -m venv venv</li>
```
```sh
$ YOUR PATH\AI_project\venv\Scripts\activate.bat</li>
```
```sh
$ C:\Users\HP\Desktop\AI_project\venv\Scripts\activate.bat</li>
```
```sh 
$ Run using "run.py" </li> 
``` -->

#### Features

- [x] Emotional Analysis
<h5> A couple involved in a relationship will be going through a wide range of emotions. When that relationship is in turmoil, even greater emotion is displayed and many do not know how to handle them or overcome them. These emotions may be affecting them mentally and they may not even be aware of it as they are occupied with other thoughts, This module will focus on analysing how the uses are feeling about themselves or how they are feeling about their relationship. Based on the analysis made on their response, appropriate solutions will be provided to help them tackle their problems. </h5>

- [x] Map
<h5> Imagine after a doctor appointment, you are required to visit different kind of therapy centres, there are a lot of constraints and requirements and many possible therapy centres to choose from or suppose you need to choose the best centre according to your needs, this is where our map module is handy.
Consider a scenario, where you want to cover different therapy centres for different treatments and also want to optimize your journey so that we cover the least total distance. For example if the requirements are art therapy and depression we only need to cover two centres which offer these services. </h5>

- [x] Clustering
<h5> Anyone who is emotionally at a low point needs support
and counselling to overcome their grief. Therapy and
especially group therapy is an effective method. In group
therapy people express their issues and problems with
similar peers and is helped by the peers and the therapist
to overcome their grief and sorrow.This is where the clustering module is used. With the use of various clustering algorithms, the form input entered by the user is taken as the attributes for clustering purpose. People who answered similarly in the questionnaire would be facing similar issues and similar people would be grouped to the same cluster.Similar people grouped into the same group therapy session, would lead to faster improvement and betterment of the patients.
 </h5>
 
- [x] Divorce Predictor
<h5>This module forms the heart of the application with various other modules 
being dependent on the output of this module. The main function of the module is to predict whether the user will get a divorce based on the input provided by the user.
The input from the user is taken through a form and fed to the trained 
machine learning model which resides in the backend. The model will then produce a prediction which will then be displayed to the user.
Eight ML models have been trained and tested. Gradient Boosting with cross validation has given the highest accuracy. Since GB has given the highest accuracy, it is used for prediction.</h5>
