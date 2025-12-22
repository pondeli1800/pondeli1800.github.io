import json
from string import Template
from pathlib import Path

# =========================
# Set your article variables here
# =========================
title = "Mandava Jazz 2026"
meta = "Koncert" 
description = "V říjnu jsem si zahráli na Mandava Jazzu a bylo to mega super"
youtube_link = ""  # Leave empty if no video
video_title = "Edith with the Stick #livemusic #concert"
url_slug = "mandava-jazz-2026"
output_file = f"aktuality/{url_slug}/index.html"

# =========================
# HTML template (iframe optional)
# =========================
html_template = Template("""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Pondělí 18:00 - $title</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <link href="/favicon.ico" rel="icon">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;700&family=Work+Sans:wght@400;600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">
    <link href="/lib/animate/animate.min.css" rel="stylesheet">
    <link href="/lib/lightbox/css/lightbox.min.css" rel="stylesheet">
    <link href="/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">
    <link href="/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/style.css" rel="stylesheet">

    <style>
        .article-content p { margin-bottom: 1.5rem; }
        .article-content strong { color: #0d6efd; }
    </style>
</head>
<body>
    <div id="spinner" class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div class="spinner-grow text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Načítá se</span>
        </div>
    </div>

    <div class="container-fluid p-0">
        <div id="site-header"></div>
    </div>

    <article class="row justify-content-center my-5 article-page">
        <div class="col-lg-8">
            <div class="article-inner mx-auto" style="max-width: 700px;">
                <header class="mb-4 text-center">
                    <h1 class="display-4 text-uppercase mb-3 animated slideInDown fw-bold">$title</h1>
                    <p class="text-muted fs-5">$meta</p>
                    <hr class="my-4">
                </header>

                <div class="article-content fs-5 lh-lg animated fadeInUp">
                    <p>$description</p>
                    $video_block
                    <a href="/" class="d-block mt-4">Zpět na aktuality</a>
                </div>
            </div>
        </div>
    </article>

    <div id="site-footer"></div>

    <a href="#" class="btn btn-outline-primary border-2 btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>

    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/lib/wow/wow.min.js"></script>
    <script src="/lib/easing/easing.min.js"></script>
    <script src="/lib/waypoints/waypoints.min.js"></script>
    <script src="/lib/owlcarousel/owl.carousel.min.js"></script>
    <script src="/lib/lightbox/js/lightbox.min.js"></script>
    <script src="/js/main.js"></script>
    <script src="/partials/includes.js"></script>
</body>
</html>
""")

# =========================
# Prepare optional video block
# =========================
if youtube_link.strip():
    video_block = f'''
    <div class="video-wrapper">
        <iframe src="{youtube_link}" 
                title="{video_title}" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
        </iframe>
    </div>
    '''
else:
    video_block = ""

# =========================
# Generate HTML article
# =========================
html_content = html_template.substitute(
    title=title,
    meta=meta, 
    description=description,
    video_block=video_block
)

# Create folder if it does not exist
output_folder = Path(output_file).parent
output_folder.mkdir(parents=True, exist_ok=True)

# Write HTML file
Path(output_file).write_text(html_content, encoding="utf-8")
print(f"HTML article saved to {output_file}")


# =========================
# Update articles.json (prepend new article)
# =========================
articles_json_path = Path("aktuality/articles.json")
if articles_json_path.exists():
    articles = json.loads(articles_json_path.read_text(encoding="utf-8"))
else:
    articles = []

new_article = {
    "url": f"/aktuality/{url_slug}/",
    "title": title,
    "meta": meta  # <-- use meta variable
}
articles.insert(0, new_article)

articles_json_path.write_text(json.dumps(articles, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Updated {articles_json_path} with new article at first position.")
