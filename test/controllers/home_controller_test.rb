require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
    include Devise::Test::IntegrationHelpers

  setup do
    @user = User.create!(
      email: "test@example.com",
      password: "password",
      nickname: "テストユーザー"
    )
    sign_in @user, scope: :user
  end

  test "should get index" do
    get home_url
    assert_response :success
  end
end
