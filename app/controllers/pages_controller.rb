class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [ :index, :guide ]

  def index; end

  def guide; end
end
