<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Profile_model extends CI_Model 
{
	public function __construct()
	{
		parent::__construct();
		$this->load->config( 'masterdb_config', TRUE );
		$this->mastables = $this->config->item('masterdb_config');
	}
	
	/**
	 * add profile information
	 */
	public function add_profile_infor($data = array())
	{
		$result = $this->db->insert($this->mastables['profile_information'],$data);
		return $result;
	}
	
	/**
	 * check whther user has add profile information before
	 */
	public function is_profile_info_added($user_id,$type_id=null)
	{
		$this->db->select('*');
		$this->db->from($this->mastables['profile_information']);
		$this->db->where('ProfileID',$user_id);
		if($type_id != null)
		{
			$this->db->where('InforTypeID',$type_id);
		}
		$query = $this->db->get();
		$result = $query->result_array();
		if($result)
		{
			return true;
		}
		else
		{
			return false;	
		}
		
	}
	
	/**
	 * update profile information by information id
	 */
	public function update_profile_infor($id,$data=array())
	{
		$this->db->where('ProfileInforID',$id);
		return $this->db->update($this->mastables['profile_information'],$data);
	}
	
	public function update_basic_information($data=array())
	{
		$ProfileID=$data['ProfileID'];
		$this->db->where('ProfileID',$ProfileID);
		return $this->db->update($this->mastables['user'],$data);
	}
	/**
	 * update user infor by type and user id
	 */
	public function update_user_profile_info($user_id,$data)
	{
		$this->db->where('ProfileID',$user_id);
		return $this->db->update($this->mastables['profile_information'],$data);
	}
	
	/**
	 * delete profile information by information id
	 */
	public function delete_profile_infor($id)
	{
		$this->db->where('ProfileInforID',$id);
		return $this->db->update($this->mastables['profile_information'],array('IsDelete'=>1));
	}
	
	/**
	 * get user profile information for a user
	 */
	public function get_profile_information($profile_id)
	{
		$this->db->select('*');
		$this->db->from($this->mastables['profile_information']);
		$this->db->where('ProfileID',$profile_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	
	/**
	 * upload user profiel picture
	 * @param unknown $ProfilePicture
	 * @param unknown $ProfileID
	 */
	public function upload_profile_pic($ProfilePicture,$ProfileID){
		$this->db->where('ProfileID',$ProfileID);
		$this->db->set('ProfilePicture',$ProfilePicture);
		return $this->db->update($this->mastables['user']);
	}
	
	/**
	 * get user information by profile id
	 * @param int $profile_id
	 * @return array
	 */
	public function get_user_information($profile_id)
	{
		$this->db->select('*');
		$this->db->from($this->mastables['user']);
		$this->db->where('ProfileID',$profile_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	
	
	/**
	 * update profile completion level parameters of a user
	 * @param array $data
	 * @return boolean
	 */
	public function update_profile_completion_level($data)
	{
		$this->db->where('ProfileID',$data['ProfileID']);
		return $this->db->update($this->mastables['profile_completion'],$data);
		
	}
	
	/**
	 * add profile completion level parameters of a user
	 * @param array $data
	 * @return boolean
	 */
	public function add_profile_completion_level($data)
	{
		return $this->db->insert($this->mastables['profile_completion'],$data);
	}
	
	/**
	 * select profile completion level of a user
	 * @param int $profile_id
	 * @return array
	 */
	public function get_profile_completion_level($profile_id)
	{
		$this->db->select('*');
		$this->db->from($this->mastables['profile_completion']);
		$this->db->where('ProfileID',$profile_id);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	
	public function update_profile_alubm_id($album_id,$user_id)
	{
		$data = array(	
						'ProfileAlbumID'=>$album_id
					);
		$this->db->where('ProfileID',$user_id);
		return $this->db->update($this->mastables['user'],$data);
	}
	
	/**
	 * get interest list from DB
	 */
	public function get_interest_checkboxes()
	{
		$this->db->select('*');
		$this->db->from($this->mastables['interest_list']);
		$this->db->where('IsDelete',0);
		$this->db->where('Type',1);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	
	/**
	 * get interest list from DB
	 */
	public function get_entertainment_checkboxes()
	{
		$this->db->select('*');
		$this->db->from($this->mastables['interest_list']);
		$this->db->where('IsDelete',0);
		$this->db->where('Type',2);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}	
	
	/**
	 * check interest id is already inserted 
	 * @param unknown_type $data
	 */
	public function check_interest($data)
	{
		$this->db->select('*');
		$this->db->from($this->mastables['user_interests']);
		$this->db->where('ProfileID',$data['ProfileID']);
		$this->db->where('InterestID',$data['InterestID']);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	
	/**
	 * add user interest list 
	 * @param unknown_type $data
	 */
	public function add_user_interest($data)
	{
		return $this->db->insert($this->mastables['user_interests'],$data);
	}
	
	/**
	 * update user interes list 
	 * @param unknown_type $data
	 */
	public function update_user_interest($data)
	{
		$this->db->where('ProfileID',$data['ProfileID']);
		$this->db->where('InterestID',$data['InterestID']);
		$this->db->set('UpdateBy',$data['CreatedBy']);
		$this->db->set('UpdateOn',$data['CreatedOn']);
		if($data['IsDelete']==0){
		$this->db->set('IsDelete',0);
		}
		else{
		$this->db->set('IsDelete',1);
		}
		return $this->db->update($this->mastables['user_interests']);
	}
	
	/**
	 * get interest list from user interest list
	 */
	public function get_interest_list($ProfileID)
	{
		$this->db->select('InterestID');
		$this->db->from($this->mastables['user_interests']);
		$this->db->where('ProfileID',$ProfileID);
		$this->db->where('IsDelete',0);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	
	
	
}