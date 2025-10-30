class Users::RegistrationsController < Devise::RegistrationsController
  def create
    super do |user|
      set_flash_message!(:notice, :signed_up, name: user.nickname)
    end
  end
end
