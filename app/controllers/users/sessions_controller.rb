class Users::SessionsController < Devise::SessionsController
  def create
    super do |user|
      set_flash_message!(:notice, :signed_in, name: user.nickname)
    end
  end
end
