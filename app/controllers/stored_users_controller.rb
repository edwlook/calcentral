class StoredUsersController < ApplicationController

  def get
    authorize(current_user, :can_view_as?)
    users_found = User::StoredUsers.get(params['uid'])
    render json: { users: users_found }.to_json
  end

end
