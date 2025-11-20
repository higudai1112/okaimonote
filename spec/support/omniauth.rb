require 'omniauth'

OmniAuth.config.test_mode = true

module OmniauthMacros
  # Google モック
  def mock_google_oauth(email:, name:, image: nil, uid: "test-google-uid-123")
    OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new(
      provider: 'google_oauth2',
      uid: uid,
      info: {
        email: email,
        name:  name,
        image: image
      }
    )
  end

  # LINE モック
  def mock_line_oauth(email:, name:, image: nil, uid: "test-line-uid-456")
    OmniAuth.config.mock_auth[:line] = OmniAuth::AuthHash.new(
      provider: 'line',
      uid: uid,
      info: {
        email: email,
        name:  name,
        image: image
      }
    )
  end
end

RSpec.configure do |config|
  config.include OmniauthMacros
end
