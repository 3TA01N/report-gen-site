import React, { useState, useEffect } from 'react';
import {
    Autocomplete,
    TextField,
    Box,
    AutocompleteChangeReason,
    AutocompleteChangeDetails,
  } from '@mui/material';
import api from './api'
type OptionType = {
    value: string;
    label: string;
  }

type MultiSelectAgentsProps = {
    passNamesToParent: (selectedNames: string[]) => void;
}

const MultiselectPapers: React.FC<MultiSelectAgentsProps> =({passNamesToParent}) => {
    const [agentOptions, setOptions] = useState<OptionType[] | undefined>([])//Store options for multiselect
    
    const handleSelectAgentsChange = (
        _event: React.SyntheticEvent,
        value: OptionType[],
        _reason: AutocompleteChangeReason,
        _details?: AutocompleteChangeDetails<OptionType>
      ) => {
        passNamesToParent(value.map((v) => v.label));
      };
    useEffect(() => {
        const getAgents = async() => {
            try {
                console.log("getting agents")
                const response = await api.get('/agents/')
                const options = response.data.map((cur_agent : any) => ({
                    value: cur_agent.name,
                    label: cur_agent.name,
                }));
                setOptions(options)
            }
            catch (error:any) {
                console.log('Error fetching agents', error.response)
            }
        }
        getAgents()
    },[]);

    return (

        <Box>
            
            <Autocomplete
                multiple
                options={agentOptions || []}
                getOptionLabel={(option) => option.label}
                onChange={handleSelectAgentsChange}
                renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Agents" />
                )}
            />
        </Box>
        
    )
}

export default MultiselectPapers;