<?php if (! defined ( 'BASEPATH' )) 	exit ( 'No direct script access allowed' );


class Profile
{
	/**
	 * CodeIgniter global
	 *
	 * @var string
	 * */
	protected $ci;
	
	public function __construct()
	{
		$this->ci = & get_instance();
		$this->ci->load->model('profile/profile_model');
	}
	
	/**
	 * add profile information
	 */
	public function add_profile_infor($data = array())
	{
		return $this->ci->profile_model->add_profile_infor($data);
	}
	
	public function update_basic_information($data=array())
	{
		return $this->ci->profile_model->update_basic_information($data);
	}
	/**
	 * check whther user has add profile information before
	 */
	public function is_profile_info_added($user_id,$type_id=null)
	{
		return $this->ci->profile_model->is_profile_info_added($user_id,$type_id=null);
	}

	/**
	 * update profile information by information id
	 */
	public function update_profile_infor($id,$data=array())
	{
		return $this->ci->profile_model->update_profile_infor($id,$data);
	}
	
	/**
	 * update user infor by type and user id
	 */
	public function update_user_profile_info($user_id,$data)
	{
		return $this->ci->profile_model->update_user_profile_info($user_id,$data);
	}
	
	
	/**
	 * delete profile information by information id
	 */
	public function delete_profile_infor($id)
	{
		return $this->ci->profile_model->delete_profile_infor($id);
	}
	
	/**
	 * get user profile information for a user
	 */
	public function get_profile_information($profile_id)
	{
		return $this->ci->profile_model->get_profile_information($profile_id);
	}
	
	/**
	 * upload user profile picture
	 * @param unknown $ProfilePicture
	 * @param unknown $ProfileID
	 */
	public function upload_profile_pic($ProfilePicture,$ProfileID){
		return $this->ci->profile_model->upload_profile_pic($ProfilePicture,$ProfileID);
	}
	
	/**
	 * get all user information by profileID -table (user) 
	 * @param unknown_type $profile_id
	 */
	public function get_user_information($profile_id)
	{
		return $this->ci->profile_model->get_user_information($profile_id);
	}
	
	
	/**
	 * update profile completion level parameters of a user
	 * @param array $data
	 * @return boolean
	 */
	public function update_profile_completion_level($index ,$profile_id)
	{
		$status = $this->ci->profile_model->get_profile_completion_level($profile_id);
		if(is_array($status) && !empty($status))
		{
			$data = array(
					'ProfileID'=>$profile_id,
					$index=>'1',
					'CreatedBy'=>$profile_id,
					'CreatedOn'=>time()
			);
			return $this->ci->profile_model->update_profile_completion_level($data);
		}
		else
		{
			$data = array(
					'ProfileID'=>$profile_id,
					$index=>'1',
					'UpdatedBy'=>$profile_id,
					'UpdatedOn'=>time()
			);
			return $this->ci->profile_model->add_profile_completion_level($data);
		}
	}
	
	/**
	 * get user profile completion level 
	 * @param unknown_type $profile_id 
	 */
	public function get_profile_completion_level($profile_id)
	{
		return $this->ci->profile_model->get_profile_completion_level($profile_id);
	}
	
	/**
	 * get interest list from DB 
	 */
	public function get_interest_checkboxes(){
		return $this->ci->profile_model->get_interest_checkboxes();
	}
	
	/**
	 * get entertainment list from DB
	 */
	public function get_entertainment_checkboxes(){
		return $this->ci->profile_model->get_entertainment_checkboxes();
	}
	
	/**
	 * create interest list - profile details
	 */
	public function create_interest($data){
		$is_check = $this->ci->profile_model->check_interest($data);
		if(empty($is_check)){
			return $this->ci->profile_model->add_user_interest($data);
		}
		else{
			return $this->ci->profile_model->update_user_interest($data);
		}
	}
	
	/**
	 * get interest list from user interest list 
	 */
	public function get_interest_list($ProfileID){
		return $this->ci->profile_model->get_interest_list($ProfileID);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	

}