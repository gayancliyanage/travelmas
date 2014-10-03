<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Profile_friends_model extends CI_Model 
{
	public function __construct()
	{
		parent::__construct();
		$this->load->config( 'masterdb_config', TRUE );
		$this->mastables = $this->config->item('masterdb_config');
	}
	
	/**
	 * insert all data to friends table
	 * @param $data
	 * @return boolean
	 */
	public function create_request($data = array())
	{
		$result = $this->db->insert($this->mastables['friends'],$data);
		return $result;
	}
	
	/**
	 * get friend request details with two profiles
	 * @param int $profileID
	 * @param int $personID
	 * @return array
	 */
	public function get_request_details($profileID,$personID)
	{ 
		$this->db->select('*');
		$this->db->from($this->mastables['friends']);
		$this->db->where('IsDelete',0);
		$this->db->where('RequesterID = '.$profileID.' AND AccepterID = '.$personID);
		$this->db->or_where('RequesterID = '.$personID.' AND AccepterID = '.$profileID);
		$this->db->where('IsDelete',0);
		$query = $this->db->get();
		$result = $query->result_array();
		return $result;
	}
	
	/**
	 * update request data by profile request id
	 * @param unknown $id
	 * @param unknown $data
	 */
	public function update_request_data($user_id,$person_id,$data=array())
	{
		$this->db->where('AccepterID ='.$user_id.' AND RequesterID = '.$person_id);
		$this->db->or_where('AccepterID ='.$person_id.' AND RequesterID = '.$user_id);
		if($data['FriendStatus']==2){
			$data['IsDelete']=1;
		}
		return $this->db->update($this->mastables['friends'],$data);
	}
	
	/**
	 * get friends list 
	 * @param number $request_state
	 * @param number $requester
	 * @param number $accepter
	 * @param number $limit
	 * @param number $offset
	 * @param string $search
	 * @return array
	 */
	public function get_friends_list($request_state=0,$requester=0,$accepter=0,$limit=0,$offset=0,$search=NULL)
	{
		$this->db->select('a.*,b.ProfileID as Requester,b.ProfileID as Accepter,b.*');
		$this->db->from($this->mastables['friends'].' as a');
		if($requester == $accepter)
		{
			$this->db->join($this->mastables['user'].' as b','   a.AccepterID =b.ProfileID  OR  a.RequesterID = b.ProfileID  ','inner');
			$this->db->where('(a.AccepterID ='.$requester.' OR a.RequesterID = '.$requester.') AND a.FriendStatus ='.$request_state);
		}
		elseif($requester != 0)
		{
		$this->db->join($this->mastables['user'].' as b','a.AccepterID = b.ProfileID');
		$this->db->where('RequesterID',$requester);
		$this->db->where('a.FriendStatus',$request_state);
		}
		elseif($accepter != 0)
		{
		$this->db->join($this->mastables['user'].' as b','a.RequesterID = b.ProfileID');
		$this->db->where('AccepterID',$accepter);
		$this->db->where('a.FriendStatus',$request_state);
		}
		
		$this->db->where('b.IsDelete',0);
		$this->db->where('a.IsDelete',0);
		$query = $this->db->get();
	
		$result = $query->result_array();//echo $this->db->last_query();die;
		return $result;
	}
	
}