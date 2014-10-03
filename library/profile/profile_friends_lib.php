<?php if (! defined ( 'BASEPATH' )) 	exit ( 'No direct script access allowed' );


class Profile_friends_lib
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
		$this->ci->load->model('profile/profile_friends_model');
	}
	
	/**
	 * add request data
	 * @param unknown $data
	 */
	public function create_request($data = array())
	{
		return $this->ci->profile_friends_model->create_request($data);
	}
	
	/**
	 * get request details between two profiles
	 * @param unknown $profileID
	 * @param unknown $personID
	 */
	public function get_request_details($profileID,$personID)
	{
		return $this->ci->profile_friends_model->get_request_details($profileID,$personID);
	}
	
	/**
	 * update request data by profile request id
	 * @param unknown $id
	 * @param unknown $data
	 */
	public function update_request_data($user_id,$person_id,$data)
	{
		return $this->ci->profile_friends_model->update_request_data($user_id,$person_id,$data);
	}
	
	/**
	 * get friend list
	 * @param number $request_state
	 * @param number $requester
	 * @param number $accepter
	 * @param number $limit
	 * @param number $offset
	 * @param string $search
	 */
	public function get_friends_list($request_state=0,$requester=0,$accepter=0,$limit=0,$offset=0,$search=NULL)
	{
		return $this->ci->profile_friends_model->get_friends_list($request_state,$requester,$accepter,$limit,$offset,$search);
	}
	

}