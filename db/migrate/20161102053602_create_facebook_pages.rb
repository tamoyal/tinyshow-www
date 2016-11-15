class CreateFacebookPages < ActiveRecord::Migration[5.0]
  def change
		create_table :user_facebook_pages do |t|
			t.string :facebook_id
			t.string :facebook_access_token
			t.string :graph_payload
      t.datetime :deactivated_at
			t.references :user, foreign_key: true
			t.timestamps
		end
    add_index :user_facebook_pages, [:user_id, :facebook_id], unique: true
  end
end
