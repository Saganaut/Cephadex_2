import logging
from flask import Blueprint, render_template
from models.models_ import BlogPost, User, Images
from flask import jsonify

logger = logging.getLogger("flask_app")

info_bp = Blueprint(
    "info_bp", __name__, template_folder="templates/info_bp", static_folder="static"
)


@info_bp.route("/legal", methods=["GET", "POST"])
def legal():
    return render_template("/info_bp/legal.html", title="Legal")


@info_bp.route("/pricing", methods=["GET", "POST"])
def pricing():
    return render_template("/info_bp/pricing.html")


@info_bp.route("/terms_and_conditions")
def terms_and_conditions():
    return render_template(
        "/info_bp/terms_and_conditions.html", title="Terms and Conditions"
    )


@info_bp.route("/documentation/", methods=["GET", "POST"])
def documentation():
    return render_template("/info_bp/documentation.html")


@info_bp.route("/api_0/blog/<slug>", methods=["GET"])
def blog_post_api(slug):
    if slug == "latest" or slug == "blog":
        post = get_latest_post()

    else:
        post = get_post_by_slug(slug)
    if post:
        post = post.to_json()
        print("post is", post)
        if post["user-id"]:
            post = add_avatar_to_post(post)
        post = add_images_to_post(post)

        return jsonify(post), 200
    else:
        return jsonify({"error": "Post not found"}), 404


@info_bp.route("/api_0/blog/fetch_list_all_posts", methods=["GET"])
def fetch_list_all_posts():
    post_titles_and_slugs = []
    blog_posts = BlogPost.query.order_by(BlogPost.time_created.desc()).all()
    for post in blog_posts:
        post_titles_and_slugs.append(
            {
                "title": post.title,
                "slug": post.slug,
                "summary": post.summary,
                "time_created": post.time_created,
                "category": post.category,
                "author_name": post.author_name,
            }
        )
    return jsonify(post_titles_and_slugs), 200


def get_latest_post():
    post = BlogPost.query.order_by(BlogPost.time_created.desc()).first()
    return post


def get_post_by_slug(slug):
    post = BlogPost.query.filter_by(slug=slug).first()
    return post


def add_images_to_post(post):
    if "images" not in post or not isinstance(post["images"], list):
        post["images"] = []

    images = Images.query.filter_by(blog_id=post["id"]).all()
    if images:
        for image in images:
            image_data = {
                "name": image.name,
                "image_url": image.image_url,
                "thumbnail_url": image.thumbnail_url,  # Corrected typo here
            }
            post["images"].append(image_data)

    return post


def add_avatar_to_post(post):
    user = User.query.filter_by(id=post["user-id"]).first()
    print("post in add avatar")
    if user.pic:
        post["avatar"] = user.pic
    print(post["avatar"])
    return post
