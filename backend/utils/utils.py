from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.llms import OpenAI
from langchain.chains.question_answering import load_qa_chain
from langchain.callbacks import get_openai_callback
import pickle
import os
from colorama import Fore
# load api key lib
from dotenv import load_dotenv
load_dotenv(".env")



def gen_pkl(pdf):
    dir_name = os.path.dirname(pdf)

    if pdf is not None:
        pdf_reader = PdfReader(pdf)

        text = ""
        for page in pdf_reader.pages:
            text+= page.extract_text()

        # langchain_textspliter
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size = 1000,
            chunk_overlap = 200,
            length_function = len
        )

        chunks = text_splitter.split_text(text=text)

        store_name_full = pdf.split('/')[-1]
        store_name = store_name_full[:-4]
        if os.path.exists(f"{dir_name}/{store_name}.pkl"):
            with open(f"{dir_name}/{store_name}.pkl","rb") as f:
                vectorstore = pickle.load(f)
                print(Fore.GREEN + f"Vector Store for {store_name_full} loaded from cache.")

        else:
            # embedding (Openai methods)
            embeddings = OpenAIEmbeddings(openai_api_key="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")

            # Store the chunks part in db (vector)
            vectorstore = FAISS.from_texts(chunks,embedding=embeddings)

            with open(f"{dir_name}/{store_name}.pkl","wb") as f:
                pickle.dump(vectorstore,f)

    return vectorstore
                


def get_response(query, vectorstore):
    if query:
        docs = vectorstore.similarity_search(query=query,k=3)
        
        # openai rank lnv process
        llm = OpenAI(temperature=0)
        chain = load_qa_chain(llm=llm, chain_type= "stuff")
        
        with get_openai_callback() as cb:
            response = chain.run(input_documents = docs, question = query)
            print(Fore.GREEN + str(cb))
            return response