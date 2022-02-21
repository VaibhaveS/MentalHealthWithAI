from flask import Flask,render_template
from proj import app
from proj import routes


if __name__=="__main__":
    app.run(debug=True)