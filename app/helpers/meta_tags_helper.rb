module MetaTagsHelper
  def default_meta
    {
      site: "おかいもノート | okaimonote",
      title: content_for?(:page_title) ? content_for(:page_title) : "家計にやさしい買い物ノート",
      description: content_for?(:page_description) ? content_for(:page_description) : "日用品や食材の価格を記録して、最安値・平均・高値を可視化。買い物リストもサクッと管理。",
      image: og_image_url, # 絶対URL
      url: request.original_url,
      type: content_for?(:og_type) ? content_for(:og_type) : "website",
      locale: "ja_JP"
    }
  end

  def og_image_url
    # ページ側で content_for :og_image_url を設定していればそれを使う
    if content_for?(:og_image_url)
      to_absolute_url(content_for(:og_image_url))
    else
      # 共通のデフォルトOGP
      to_absolute_url(asset_path("ogp.png"))
    end
  end

  def to_absolute_url(path_or_url)
    uri = Addressable::URI.parse(path_or_url)
    return path_or_url if uri.scheme.present? # 既に絶対URLならそのまま
    Addressable::URI.join(request.base_url, path_or_url).to_s
  end
end