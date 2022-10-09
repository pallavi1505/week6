# this implementation i have completed in digital ocean
def main(args):
    keyword = args.get("keyword")
    greeting = "Pallavi says " + keyword + "!"
    return {"body": greeting}


#output link :
#  https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-b0815861-ca69-4b22-be2c-bbc0de1c26d4/default/say?keyword=Good Evening!
