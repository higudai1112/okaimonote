require "rqrcode"
require "rqrcode_svg"

module FamiliesHelper
  def family_invite_qr_svg(family)
    # 招待URLをQRコードに変換
    url = family_invite_url(family.invite_token)

    qr = RQRCode::QRCode.new(url)

    svg = qr.as_svg(
      offset: 0,
      color: "000000",
      shape_rendering: "crispEdges",
      module_size: 3,
      standalone: true
    )

    svg.html_safe
  end
end
