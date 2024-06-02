from flask import Flask, jsonify, request  
from flask_cors import CORS,cross_origin
from dotenv import load_dotenv, find_dotenv
from bson import ObjectId
import os
import pprint
from pymongo import MongoClient

from langchain.vectorstores import qdrant
from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings
import qdrant_client
from langchain_community.vectorstores import Qdrant

import spacy

from qdrant_client.http import models as qdrant_models
from qdrant_client import QdrantClient, models

from transformers import LlamaTokenizer, LlamaForCausalLM, GenerationConfig, pipeline, BitsAndBytesConfig , CodeGenTokenizer
from langchain.llms import HuggingFacePipeline
from langchain import PromptTemplate, LLMChain
from transformers import AutoTokenizer , AutoModelForCausalLM
# # import torch

from transformers import pipeline
# import torch

from langchain import PromptTemplate, LLMChain

import json

nlp = spacy.load("en_core_web_trf")


embeddings = HuggingFaceEmbeddings(
     model_name="avsolatorio/GIST-Embedding-v0"
)
# embeddings.save("path/to/save/model")

tokenizer = AutoTokenizer.from_pretrained("microsoft/phi-2")
model = AutoModelForCausalLM.from_pretrained("microsoft/phi-2")

# tokenizer.save_pretrained("path/to/save/model")
# model.save_pretrained("path/to/save/model")

os.environ['QDRANT_HOST'] = "https://b3374924-ea31-4673-a8a6-0d965ff00bb1.us-east4-0.gcp.cloud.qdrant.io:6333"
os.environ['QDRANT_API_KEY'] = "h6BBKj1cl9gfgsx_5Y2ynLU8l4v9T54RZF68ljwmharfBx0XHCjUEQ"

client = qdrant_client.QdrantClient(
    os.getenv("QDRANT_HOST"),
    api_key = os.getenv("QDRANT_API_KEY")
)

os.environ["QDRANT_COLLECTION_NAME"] = "my-hotels"

qdrant_client = QdrantClient(
    url="https://b3374924-ea31-4673-a8a6-0d965ff00bb1.us-east4-0.gcp.cloud.qdrant.io:6333",
    api_key=os.getenv("QDRANT_API_KEY"),
)

inference_api_key = "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"

# loaded_embeddings = HuggingFaceEmbeddings.load("path/to/save/model") # path to the model saved locally

vector_store = Qdrant(
    client = client,
    collection_name = os.getenv("QDRANT_COLLECTION_NAME"),
    embeddings = embeddings,
)



# Load the trained spaCy NER model from the specified path
nlp = spacy.load('/Users/sanjith/Desktop/SAP/server/Custom_NER/trained_models/output/model-best')

tokenizer = AutoTokenizer.from_pretrained("microsoft/phi-2") # path to load the tokenizer from local system

model = AutoModelForCausalLM.from_pretrained("microsoft/phi-2") # path to load the model from local system

pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    max_length=600,
    repetition_penalty=1.2
)

local_llm = HuggingFacePipeline(pipeline=pipe)

pipe.model.config.pad_token_id = pipe.model.config.eos_token_id









app = Flask(__name__)
CORS(app)  
CORS(app)

load_dotenv(find_dotenv())
password = os.environ.get("MONGODB_PWD")

connection_string = f"mongodb+srv://sanjithkaran22:{password}@tutorial.zjcakom.mongodb.net/?retryWrites=true&w=majority&appName=tutorial"
client = MongoClient(connection_string)


db = client.list_database_names()
users_db = client.users
print("Users database:", db)


@app.route("/",methods=['GET']) 
def hello():
    return jsonify({"about":"Hello World!"})

@app.route("/home", methods=["GET"])
def hi():
    user_id = request.args.get('user_id')
    print(user_id)

    if user_id:
        user_data = users_db.user.find_one({"_id": ObjectId(user_id)})
        if user_data:
            username = user_data.get("username", "")
            user_searches = user_data.get("searches", [])

            # Create prompt-hotel dictionary
            prompt_hotels = {}
            for search in user_searches:
                prompt = search.get("prompt", "")
                prompt_hotels[prompt] = search["hotels"]  # Use prompt as key
            
            print(username)
            print(prompt_hotels)
            
            return jsonify({"username": username, "prompts_hotels": prompt_hotels})
        else:
            return jsonify({"message": "User not found"})
    else:
        return jsonify({"message": "Please login to view your prompts"})



# @app.route("/home", methods=["GET"])
# @cross_origin(origin='http://localhost:5173', supports_credentials=True)
# def history():
#     user_id = request.args.get('user_id') 
#     user_searches = users_db.user.user.find({"user_id": user_id})

#   # Check if any searches were found
#     if user_searches.count() == 0:
#         return {"error": "No searches found for user ID: {}".format(user_id)}, 404

#   # Convert the cursor to a list of dictionaries
#     searches = [search for search in user_searches]

#   # Extract prompts and hotels from each search
#     prompts = []
#     hotels = []
#     for search in searches:
#         prompts.append(search["prompt"])
#         hotels.extend(search["hotels"])

#     print("prompts",prompts)
#     print("hotels",hotels)

#   # Return the extracted data
#     return {"prompts": prompts, "hotels": hotels}


@app.route("/home", methods=["POST"])
@cross_origin(origin='http://localhost:5173', supports_credentials=True)
def prompt():
    data = request.json
    prompt_text = data.get("prompt")
    user_id_str = data.get("user_id")
    place = data.get("location")

    print("Prompt:", prompt_text)
    print("User ID:", user_id_str)
    print("location", place)

    if not prompt_text or not user_id_str:
        return jsonify({"error": "Missing prompt or user_id parameter"}), 400

    try:
        user_id = ObjectId(user_id_str)
        user_query = {"_id": user_id}
    except Exception as e:
        print("Error converting user ID:", e)
        return jsonify({"error": "Invalid user ID format"}), 400

    user_document = users_db.user.find_one(user_query)

    if user_document:
        users_db.user.update_one(user_query, {"$push": {"prompts": prompt_text}})

        query = prompt_text
        words = query.split()
        if "me" in words or "my" in words:
            location = place
        else:
            doc = nlp(query)
            locations = [ent.text for ent in doc.ents if ent.label_ in ["GPE", "ORG", "FAC", "LOC"]]
            location = locations[0] if locations else ""
        print("actual location requested", location)

        doc = nlp(query)
        conditions = {}
        conditions["address"] = location

        for ent in doc.ents:
            key = ent.label_.lower()
            value = ent.text.lower()
            if key in conditions:
                conditions[key].append(value)
            else:
                conditions[key] = [value]

        print('conditions :', conditions)

        vector_ = embeddings.embed_query(query)
        should = []

        for key, values in conditions.items():
            if key == 'user_rating':
                should.append(
                    models.FieldCondition(
                        key="metadata." + key,
                        range=models.Range(
                            gte=int(values[0]),
                        ),
                    )
                )
            elif key == 'rate_per_night':
                should.append(
                    models.FieldCondition(
                        key="metadata." + key,
                        match=models.MatchText(text=values[0][1]),
                    )
                )
            elif key == 'hotel_class':
                should.append(
                    models.FieldCondition(
                        key="metadata." + key,
                        match=models.MatchValue(value=values[0]),
                    )
                )
            elif key == 'address':
                should.append(
                    models.FieldCondition(
                        key="metadata." + key,
                        match=models.MatchText(text=" ".join(values)),
                    )
                )

        filter_1 = models.Filter(
            must=should + [models.FieldCondition(
                key="metadata.address",
                match=models.MatchText(text=" ".join(conditions["address"])),
            )],
        )

        filter_2 = models.Filter(
            should=should,
            must=[models.FieldCondition(
                key="metadata.address",
                match=models.MatchText(text=" ".join(conditions["address"])),
            ),]
        )

        print(should)
        keys_to_search = True

        if 'keys' in conditions:
            keys_to_search = conditions.get('keys')

        search_queries = [
            models.SearchRequest(vector=vector_, filter=filter_1, with_payload=True, limit=3),
            models.SearchRequest(vector=vector_, filter=filter_2, with_payload=True, limit=3),
        ]

        result = qdrant_client.search_batch(collection_name=os.getenv("QDRANT_COLLECTION_NAME"), requests=search_queries)

        for i in result:
            if len(i) > 0:
                print(i)

        result = result[0] if len(result[0]) != 0 else result[1] if len(result[1]) != 0 else []
        hotels = [i for i in result]

        template1 = """ You are a helpful bot who only answers using the given context ONLY. If you cannot find the answer in the context reply 'Sorry don't have that detail'.
                      Given the context of the hotel '{context}', answer this:{question}\nOutput:"""

        prompt = PromptTemplate(template=template1, input_variables=["context", "question"])
        llm_chain = LLMChain(prompt=prompt, llm=local_llm)

        context = ""
        keys_to_remove = ["link", "image", "description", "address", "phone", "user_rating", "rate_per_night", "hotel_class"]
        result = []

        for i in hotels:
            context_filtered = {key: value for key, value in i.payload.get("metadata").items() if key not in keys_to_remove}
            context = str(context_filtered)
            question = "State the hotel's nearby places and amenities"

            inputs = {
                "context": context,
                "question": question,
            }

            result.append(llm_chain.invoke(input=inputs))

        final_results = []

        for i, j in zip(result, hotels):
            input_string = i.get('text')
            start_index = input_string.find("Output")
            data = {key: value for key, value in j.payload.get("metadata").items() if key not in ["description"]}
            data['output'] = input_string[start_index:]
            final_results.append(data)

        if not final_results:
            print("Sorry, I couldn't find any hotels that match your criteria. Is there anything else I can assist you with?")
        else:
            hotels = []  # Contains the Final JSON formatted data

            # Process the hotels and convert ratings
            for hotel in final_results:
                user_rating = hotel['user_rating']
                if user_rating in ['user_rating', 'unknown']:
                    user_rating = 0
                else:
                    user_rating = float(user_rating)

                hotel_info = {
                    "address": hotel['address'],
                    "specification": {
                        "name": hotel['name'],
                        "phone": hotel['phone'],
                        "website": hotel['link'],
                        "class": hotel['hotel_class'],
                        "rating": user_rating,
                        "rate_per_night": hotel['rate_per_night'],
                        "amenities": str(hotel['amenities'])[1: len(hotel['amenities']) - 1],
                        "nearby_places": str(hotel['nearby_places'])[1: len(hotel['nearby_places']) - 1],
                        "image": hotel['image'],
                        "description": hotel['output'][8:]
                    }
                }
                hotels.append(hotel_info)

            # Sort hotels by user rating in descending order
            hotels = sorted(hotels, key=lambda x: x['specification']['rating'], reverse=True)

            # Convert ratings of 0 back to 'unknown'
            for hotel in hotels:
                if hotel['specification']['rating'] == 0:
                    hotel['specification']['rating'] = 'unknown'

            print('location :::::', location)
            print(hotels)

            # Add prompt and hotels to the database
            users_db.user.update_one(user_query, {"$push": {"searches": {"prompt": prompt_text, "hotels": hotels}}})

        return jsonify({"message": "Prompt added successfully", "hotels": hotels})
    else:
        return jsonify({"error": "User not found"}), 404





@app.route("/signup",methods=["POST"])
def signup():
    collection = users_db.user
    data = request.json
    username = data.get("username")
    email = data.get("email")
    passkey = data.get("password")  

    print("username :",username)
    print("email: ",email)
    print("password: ",passkey)

    test_doc = {"username":username,
                "email":email,
                "password":passkey
                }
    collection.insert_one(test_doc)

    

    return "data successfully recieved in signup page"

@app.route("/login", methods=['POST'])
@cross_origin(origin='http://localhost:5173', supports_credentials=True)
def login():
    data = request.json
    email = data.get("email")
    password = data.get('password')

    user_document = users_db.user.find_one({"email": email, "password": password})

    if user_document:
        user_id = str(user_document["_id"])
        print("User ID in backend server:", user_id)  
        return jsonify({"authenticated": True, "user_id": user_id})
    else:
        return jsonify({"authenticated": False})


@app.route("/profile", methods=['DELETE'])
@cross_origin(origin='http://localhost:5173', supports_credentials=True)
def delete_user_prompts():
  try:
    data = request.json
    user_id = data.get("user_id")
    print("userid in backend",user_id)
    print("delete process in progress");

    try:
      user_id = ObjectId(user_id)
    except Exception as e:
      print("Error converting user ID:", e)
      return jsonify({"error": "Invalid user ID format"}), 400


    user_query = {"_id": user_id}
    user_document = users_db.user.find_one(user_query)  

    if user_document:
      update_result = users_db.user.update_one(user_query, {"$set": {"prompts": []}})
      if update_result.modified_count > 0:
        return jsonify({"message": "Prompts deleted successfully"}), 200
      else:
        return jsonify({"message": "No prompts found for user"}), 404
    else:
      return jsonify({"message": "User not found"}), 404

  except Exception as e:
    return jsonify({'error': f'Error deleting prompts: {e}'}), 500



@app.route("/resetpassword", methods=['POST'])
@cross_origin(origin='http://localhost:5173', supports_credentials=True)
def reset_password():
    try:
        data = request.json
        new_password = data.get("password")
        user_id = data.get("userId")  
        print("user_id", user_id)
        print("reset password", new_password)

        if not new_password or not user_id:
            return jsonify({"error": "Missing required fields (password, userId)"}), 400

        try:
            user_id = ObjectId(user_id)
        except Exception as e:
            print("Error converting user ID:", e)
            return jsonify({"error": "Invalid user ID format"}), 400

        
        update_result = users_db.user.update_one(
            {"_id": user_id}, {"$set": {"password": new_password}}
        )

        if update_result.modified_count > 0:
            return jsonify({"message": "Password reset successfully"}), 200
        else:
            return jsonify({"error": "User not found or password not updated"}), 404

    except Exception as e:
        print("Error resetting password:", e)
        return jsonify({"error": "An error occurred. Please try again."}), 500




@app.route("/resetpassword", methods=["OPTIONS"])
def handle_options_request():
    
    headers = {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    return ("", 204, headers)  

if __name__ == "__main__":
    app.run(debug=True,port=8080)
