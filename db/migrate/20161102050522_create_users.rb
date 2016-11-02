class CreateUsers < ActiveRecord::Migration[5.0]
  def change
		create_table :users do |t|
			t.string :first_name
			t.string :last_name
			t.string :email
			t.string :phone
			t.string :facebook_id
			t.string :facebook_access_token
			t.string :facebook_graph_payload
			t.boolean :get_events_from_user_fb_account
			t.timestamps
		end
    add_index :users, :email, unique: true
    add_index :users, :facebook_id, unique: true
  end
end
