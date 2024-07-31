import React from 'react';
import { Col, Form} from 'react-bootstrap';


export default function SearchPost({search,handleSearch}) {
  return (
    <Col>
        <Form.Group className="m-3">
          <Form.Control 
                type="search" 
                placeholder="Search Post.." 
                value={search}  
                onChange={handleSearch}
          />
        </Form.Group>
      </Col>
  )
}
