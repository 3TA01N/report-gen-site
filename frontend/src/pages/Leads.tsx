import LeadForm from "../components/LeadForm";
import React, { useState, useEffect } from 'react';
import api from "../components/api"
import { useLocation } from 'react-router-dom'
import Loader from "../components/Loader"

function Leads () {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [leads, setLeads] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setLoadStatus] = useState<boolean>(false)
    const location = useLocation()
    const runEffect = location.state?.runEffect;
    useEffect(() => {
        const getLeads = async() => {
            try {
                const response = await api.get('/leads/')
                setLeads(response.data)
            }
            catch (error: any) {
                console.log('Error fetching team leads', error.response)
            }
        }
        getLeads();
    }, [isLoading, runEffect])
    
    const formSubmit = (event: React.FormEvent) => {
        
        event.preventDefault();
        const lead = {
            name: name,
            description: description
        }

        setError(null);
        const createLead = async() => {
            setLoadStatus(true)
            try {
                const response = await api.post('/leads/', lead)
                console.log('New lead created:', response.data)
                setLeads([...leads, response.data]);
                setLoadStatus(false)
            }
            catch (error: any) {
                if (error.response.data.error == "Lead name already exists.") {
                    setError("Lead name already exists. Choose a different one.")
                    console.error('Error creating new lead');
                    setLoadStatus(false)

                }
                else {
                    setError("Error:" + error.response.data.error)
                    console.error(error.response)
                    setLoadStatus(false)
                }
            }
        }
        createLead();
        
        setName('')
        setDescription('')
    }
    return (
        <div>
            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close"
                    onClick={() => setError(null)}
                ></button>
                </div>
            )}
            <h3>Create a new Team Lead</h3>
            <LeadForm 
            name={name}
            description={description}
            onNameChange={(e) => setName(e.target.value)}
            onDescriptionChange={(e) => setDescription(e.target.value)}
            onSubmit={formSubmit}
            />
            {isLoading && <Loader />}
            <h3>Current team leads</h3>
            <div className="list-group">
            {leads.map((lead) => (
                <a href={`/leads/${lead.name}/`} className="list-group-item list-group-item-action">{lead.name}</a>
            ))}
            
            </div>
        </div>


        

    );
}

export default Leads;