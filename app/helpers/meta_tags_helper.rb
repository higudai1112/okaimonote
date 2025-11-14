require "addressable/uri"

module MetaTagsHelper
  def default_meta
    {
      site: "おかいもノート | okaimonote",
      title: content_for?(:page_title) ? content_for(:page_title) : "買い物リストと価格記録がひとつに",
      description: content_for?(:page_description) ? content_for(:page_description) : "日用品や食材の価格を記録して、最安値・平均・高値をかんたんにチェック。節約をもっと身近に。",
      image: og_image_url,
      url: request.original_url,
      type: content_for?(:og_type) ? content_for(:og_type) : "website",
      locale: "ja_JP"
    }
  end

  def og_image_url
    if content_for?(:og_image_url)
      to_absolute_url(content_for(:og_image_url))
    else
      to_absolute_url(asset_path("ogp.png"))
    end
  end

  def to_absolute_url(path_or_url)
    uri = Addressable::URI.parse(path_or_url)
    return path_or_url if uri.scheme.present?
    Addressable::URI.join(request.base_url, path_or_url).to_s
  end
end
