.PHONY: start site

start:
	open index.html

# Copy only public files into the deployment directory. No compilation is needed.
site:
	rm -rf .site
	mkdir -p .site/videos
	cp index.html privacy.html imprint.html press.html .site/
	cp -R assets shots press .site/
	cp videos/writing.mp4 videos/writing.webp .site/videos/
