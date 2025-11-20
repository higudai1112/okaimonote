require 'omniauth'

OmniAuth.config.test_mode = true

module OmniauthMacros
  def mock_google_oauth(email:, name:, image: nil, uid: "test-uid-123")
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
end

RSpec.configure do |config|
  config.include OmniauthMacros
end
