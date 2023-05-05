import {Button, Form, Col} from 'react-bootstrap';
import {Box} from '@chakra-ui/react';
import {Link} from "react-router-dom";

const SearcherSearch: React.FC = () => {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <Box as="form" onSubmit={handleSubmit} className="d-flex flex-column align-items-center justify-content-center" >
            <h3><b>Help us to know you better!</b></h3>

            <Form.Group as={Col} md="3" >
            <Form.Label >Preferred area</Form.Label>
            <Form.Select aria-label="Default select example">
                <option>Select an area</option>
                <option value="1">area 1</option>
                <option value="2">area 2</option>
                <option value="3">area 3</option>
            </Form.Select>
            </Form.Group>

            <Form.Group as={Col} md="3" >
            <Form.Label>Preferred number of rooms</Form.Label>
            <Form.Control
                type="number"
                placeholder="Enter number"
                required
            />
            </Form.Group>

            <Form.Group as={Col} md="3" >
            <Form.Label>Maximum monthly payment</Form.Label>
            <Form.Control
                type="number"
                placeholder="Enter number"
                required
            />
            </Form.Group>

            <Form.Check
                type="switch"
                id="smoking-switch"
                label="Smoking"
            />
            <Form.Check
                type="switch"
                id="pets-switch"
                label="Pets"
            />
            <Link to="/searcher/searcherResults">
                <Button variant="primary" type="submit">Submit</Button>
            </Link>
        </Box>
    );
};
export default SearcherSearch;