Upload `media-feed.php` to the root of your media subdomain:

- URL should become: `https://meladmedia.michaelkumsa.com/media-feed.php`

Expected folder layout on that same subdomain:

- `images/` for gallery images and optional video posters
- `videos/` for video files

No JSON editing required after setup.

How it works:

- App calls `media-feed.php`
- Script scans `images/` and `videos/`
- Returns media list automatically

Poster rule (optional):

- If video is `videos/history-tour.mp4`
- and image exists `images/history-tour.jpg` (or `.jpeg/.png/.webp`)
- it is used as that video's poster automatically.
