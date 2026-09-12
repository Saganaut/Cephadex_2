# import argparse

# import numpy as np
# import pandas as pd
# import redis
# from openai import OpenAI
# from redis import Redis
# from redis.commands.search.query import Query

# from dependencies.settings import get_settings

# settings = get_settings()

# redis = Redis(
#     host=settings.redis.host,
#     port=settings.redis.port,
#     password=settings.redis.password,
#     decode_responses=True,
# )

# VECTOR_DIMENSION = 1536
# INDEX_NAME = "idx:EmbeddingIndex"


# def main(args):
#     open_ai = OpenAI(api_key=settings.ai.openai_api_key)
#     response = open_ai.embeddings.create(
#         input=args.search, model="text-embedding-3-small", dimensions=VECTOR_DIMENSION,
#     )
#     search_query = [response.data[0].embedding]
#     encoded_queries = [search_query]
#     query = (
#         Query("(*)=>[KNN 3 @embedding $query_vector AS vector_score]")
#         .sort_by("vector_score")
#         .return_fields("vector_score", "user_id", "deck_id", "text")
#         .dialect(2)
#     )
#     create_query_table(query, search_query, encoded_queries)


# #     query = (
# #     Query('(*)=>[KNN 3 @embedding $query_vector AS vector_score]')
# #     .sort_by('vector_score')
# #     .return_fields('deck_id', 'user_id', 'text')
# #     .dialect(2)
# # )
# #     search = response.data[0].embedding
# #     query_vector_bytes = np.array(search, dtype=np.float32).tobytes()


# # result =  redis.ft(INDEX_NAME).search(query, query_params={'query_vector': query_vector_bytes})
# # print(result)


# def create_query_table(query, queries, encoded_queries, extra_params={}):
#     results_list = []
#     for i, encoded_query in enumerate(encoded_queries):
#         result_docs = (
#             redis.ft("idx:EmbeddingIndex")
#             .search(
#                 query,
#                 {"query_vector": np.array(encoded_query, dtype=np.float32).tobytes()}
#                 | extra_params,
#             )
#             .docs
#         )
#         for doc in result_docs:
#             vector_score = round(1 - float(doc.vector_score), 2)
#             results_list.append(
#                 {
#                     "query": queries[i],
#                     "score": vector_score,
#                     "user_id": doc.user_id,
#                     "deck_id": doc.deck_id,
#                     "text": doc.text,
#                 },
#             )

#     # Optional: convert the table to Markdown using Pandas
#     queries_table = pd.DataFrame(results_list)
#     queries_table.sort_values(
#         by=["query", "score"], ascending=[True, False], inplace=True,
#     )
#     queries_table["query"] = queries_table.groupby("query")["query"].transform(
#         lambda x: [x.iloc[0]] + [""] * (len(x) - 1),
#     )

#     queries_table.to_markdown(index=False)


# if __name__ == "__main__":
#     parser = argparse.ArgumentParser(description="vector search")
#     parser.add_argument("--search", action="store", help="Search the vector db")
#     args = parser.parse_args()
#     main(args)
