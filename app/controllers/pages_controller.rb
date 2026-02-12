class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :index, :guide, :app_entry ]

  def index; end

  def guide; end

  # iOSアプリ起動時の入口
  def app_entry
    if user_signed_in?
      redirect_to home_path
    else
      redirect_to root_path
    end
  end
end
